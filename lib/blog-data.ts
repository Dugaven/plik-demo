import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ljoaqydtlwcnwomepiif.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqb2FxeWR0bHdjbndvbWVwaWlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDA2MDYsImV4cCI6MjA2NzQ3NjYwNn0.bJk4O-42MKUiedPmJQ08QzN3MXZf-m6Xbx-JsYiSXHE"

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: {
    name: string
    avatar: string
    bio: string
  }
  publishedAt: string
  updatedAt: string
  category: string
  tags: string[]
  readTime: number
  featured: boolean
  image: string
  language?: string
}

export interface BlogPostInput {
  post_title: string
  excerpt: string
  article: string
  author_info: string
  author_bio: string
  category: string
  tags: string
  read_time: number
  featured_post: string
  media_upload?: string | null
  language: string
}

export const blogCategories = [
  "Influencer Marketing",
  "Industry Trends",
  "Case Studies",
  "Best Practices",
  "Platform Updates",
] as const

function isHexEncoded(str: string): boolean {
  // Remove \x prefix if present, then check if remaining string is valid hex
  const cleanStr = str.startsWith("\\x") ? str.slice(2) : str
  return /^[0-9a-fA-F]+$/.test(cleanStr) && cleanStr.length % 2 === 0
}

function hexToString(hex: string): string {
  const cleanHex = hex.startsWith("\\x") ? hex.slice(2) : hex
  let result = ""
  for (let i = 0; i < cleanHex.length; i += 2) {
    result += String.fromCharCode(Number.parseInt(cleanHex.substr(i, 2), 16))
  }
  return result
}

function transformBlogPost(post: any): BlogPost {
  console.log("Transforming blog post:", post.post_title)

  let imageUrl = post.media_upload || "/placeholder.svg?height=400&width=600"

  if (imageUrl && typeof imageUrl === "string" && isHexEncoded(imageUrl)) {
    imageUrl = hexToString(imageUrl)
  } else {
    // Image URL is not hex-encoded or is not a string
  }

  if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("/")) {
    // Invalid decoded URL, using fallback
    imageUrl = "/placeholder.svg?height=400&width=600"
  }



  return {
    id: post.id.toString(),
    slug:
      post.slug ||
      post.post_title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    title: post.post_title,
    excerpt: post.excerpt,
    content: post.article,
    author: {
      name: post.author_info || "Anonymous",
      avatar: "/placeholder.svg?height=40&width=40",
      bio: post.author_bio || "Content creator",
    },
    publishedAt: post.created_at,
    updatedAt: post.updated_at || post.created_at,
    category: post.category,
    tags: typeof post.tags === "string" ? post.tags.split(",").map((tag) => tag.trim()) : [],
    readTime: post.read_time || 5,
    featured: post.featured_post === "true" || post.featured_post === true,
    image: imageUrl,
    language: post.language || "en",
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase.from("blog_post").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching blog posts:", error)
    return []
  }

  return data?.map(transformBlogPost) || []
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_post")
    .select("*")
    .eq("featured_post", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching featured posts:", error)
    return []
  }

  return data?.map(transformBlogPost) || []
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {

  const { data, error } = await supabase.from("blog_post").select("*")

  if (error) {
    console.error("[v0] Error fetching posts for slug lookup:", error)
    return undefined
  }

  if (!data) return undefined

  // Transform all posts and find the one with matching slug
  const transformedPosts = data.map(transformBlogPost)
  const matchingPost = transformedPosts.find((post) => post.slug === slug)

  return matchingPost
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  console.log("[v0] Fetching posts by category:", category)
  const { data, error } = await supabase
    .from("blog_post")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching posts by category:", error)
    return []
  }

  return data?.map(transformBlogPost) || []
}

export async function getRecentPosts(limit = 3): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_post")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("[v0] Error fetching recent posts:", error)
    return []
  }

  return data?.map(transformBlogPost) || []
}

export async function getAllTags(): Promise<string[]> {
  console.log("[v0] Fetching all tags from blog posts")
  const { data, error } = await supabase.from("blog_post").select("tags")

  if (error) {
    console.error("[v0] Error fetching tags:", error)
    return []
  }

  const tags =
    data?.flatMap((post) => (typeof post.tags === "string" ? post.tags.split(",").map((tag) => tag.trim()) : [])) || []

  return [...new Set(tags)].sort()
}

export async function getRelatedPosts(postId: string, limit = 3): Promise<BlogPost[]> {
  console.log("[v0] Fetching related posts for:", postId)
  const currentPost = await getPostById(postId)
  if (!currentPost) return []

  const { data, error } = await supabase
    .from("blog_post")
    .select("*")
    .eq("category", currentPost.category)
    .neq("id", postId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("[v0] Error fetching related posts:", error)
    return []
  }

  return data?.map(transformBlogPost) || []
}

export async function getPostById(id: string): Promise<BlogPost | undefined> {
  console.log("[v0] Fetching blog post by ID:", id)
  const { data, error } = await supabase.from("blog_post").select("*").eq("id", id).single()

  if (error) {
    console.error("[v0] Error fetching post by ID:", error)
    return undefined
  }

  return data ? transformBlogPost(data) : undefined
}

export async function createBlogPost(postData: BlogPostInput): Promise<BlogPost | null> {
  console.log("[v0] Creating new blog post:", postData.post_title)
  const { data, error } = await supabase.from("blog_post").insert([postData]).select().single()

  if (error) {
    console.error("[v0] Error creating blog post:", error)
    return null
  }

  return data ? transformBlogPost(data) : null
}

export async function updateBlogPost(id: string, postData: Partial<BlogPostInput>): Promise<BlogPost | null> {
  console.log("[v0] Updating blog post:", id)
  const { data, error } = await supabase.from("blog_post").update(postData).eq("id", id).select().single()

  if (error) {
    console.error("[v0] Error updating blog post:", error)
    return null
  }

  return data ? transformBlogPost(data) : null
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  console.log("[v0] Deleting blog post:", id)
  const { error } = await supabase.from("blog_post").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting blog post:", error)
    return false
  }

  return true
}

export async function getPostsByLanguage(language: string): Promise<BlogPost[]> {
  console.log("[v0] Fetching posts by language:", language)
  const { data, error } = await supabase
    .from("blog_post")
    .select("*")
    .eq("language", language)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching posts by language:", error)
    return []
  }

  return data?.map(transformBlogPost) || []
}

export async function getFeaturedPostsByLanguage(language: string): Promise<BlogPost[]> {
  console.log("[v0] Fetching featured posts by language:", language)
  const { data, error } = await supabase
    .from("blog_post")
    .select("*")
    .eq("language", language)
    .eq("featured_post", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching featured posts by language:", error)
    return []
  }

  return data?.map(transformBlogPost) || []
}

export const getBlogPostBySlug = getPostBySlug
export const getBlogPostBySlugFromDB = getPostBySlug
