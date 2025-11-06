import { supabase } from "./supabase"

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
  console.log("[v0] Transforming blog post:", post.post_title)
  console.log("[v0] Raw media_upload value:", post.media_upload)
  console.log("[v0] media_upload type:", typeof post.media_upload)

  let imageUrl = post.media_upload || "/placeholder.svg?height=400&width=600"

  if (imageUrl && typeof imageUrl === "string" && isHexEncoded(imageUrl)) {
    console.log("[v0] Detected hex-encoded image URL, decoding...")
    console.log("[v0] Hex string:", imageUrl)
    imageUrl = hexToString(imageUrl)
    console.log("[v0] First decode result:", imageUrl)

    if (isHexEncoded(imageUrl)) {
      console.log("[v0] Detected double hex-encoding, decoding again...")
      imageUrl = hexToString(imageUrl)
      console.log("[v0] Second decode result:", imageUrl)
    }
  } else {
    console.log("[v0] Image URL is not hex-encoded or is not a string")
  }

  if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("/")) {
    console.log("[v0] Invalid decoded URL, using fallback")
    imageUrl = "/placeholder.svg?height=400&width=600"
  }

  console.log("[v0] Final image URL:", imageUrl)

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
  console.log("[v0] Fetching all blog posts from Supabase")
  const { data, error } = await supabase.from("blog_post").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching blog posts:", error)
    return []
  }

  return data?.map(transformBlogPost) || []
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
  console.log("[v0] Fetching featured blog posts from Supabase")
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
  console.log("[v0] Fetching blog post by slug:", slug)

  const { data, error } = await supabase.from("blog_post").select("*")

  if (error) {
    console.error("[v0] Error fetching posts for slug lookup:", error)
    return undefined
  }

  if (!data) return undefined

  // Transform all posts and find the one with matching slug
  const transformedPosts = data.map(transformBlogPost)
  const matchingPost = transformedPosts.find((post) => post.slug === slug)

  console.log("[v0] Found matching post for slug:", slug, matchingPost ? "YES" : "NO")
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
  console.log("[v0] Fetching recent blog posts, limit:", limit)
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
