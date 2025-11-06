"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, Eye, Calendar, Clock, Filter } from "lucide-react"
import { getAllPosts, blogCategories, deleteBlogPost, updateBlogPost, type BlogPost } from "@/lib/blog-data"

export default function BlogAdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await getAllPosts()
        setPosts(fetchedPosts)
      } catch (error) {
        console.error("Error loading posts:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDeletePost = async (postId: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      const success = await deleteBlogPost(postId)
      if (success) {
        setPosts(posts.filter((post) => post.id !== postId))
      } else {
        alert("Error deleting post. Please try again.")
      }
    }
  }

  const toggleFeatured = async (postId: string) => {
    const post = posts.find((p) => p.id === postId)
    if (!post) return

    const updatedPost = await updateBlogPost(postId, {
      featured_post: (!post.featured).toString(),
    })

    if (updatedPost) {
      setPosts(posts.map((p) => (p.id === postId ? updatedPost : p)))
    } else {
      alert("Error updating post. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center p-1">
                <img src="/logo-new.png" alt="InfluenceCA Logo" className="h-full w-full object-contain" />
              </div>
              <span className="font-bold text-xl">Plik Admin</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/admin/blog" className="text-sm font-medium text-emerald-600">
                Blog Management
              </Link>
              <Link href="/" className="text-sm font-medium hover:text-emerald-600 transition-colors">
                Back to Site
              </Link>
            </nav>
            <Link href="/admin/blog/new">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </Link>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading blog posts...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center p-1">
              <img src="/logo-new.png" alt="InfluenceCA Logo" className="h-full w-full object-contain" />
            </div>
            <span className="font-bold text-xl">Plik Admin</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/admin/blog" className="text-sm font-medium text-emerald-600">
              Blog Management
            </Link>
            <Link href="/" className="text-sm font-medium hover:text-emerald-600 transition-colors">
              Back to Site
            </Link>
          </nav>
          <Link href="/admin/blog/new">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black mb-2">Blog Management</h1>
            <p className="text-muted-foreground">Manage your blog posts, create new content, and track performance.</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Badge variant="outline" className="text-sm">
              {filteredPosts.length} posts
            </Badge>
            <Badge variant="outline" className="text-sm">
              {posts.filter((p) => p.featured).length} featured
            </Badge>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts by title or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="all">All Categories</option>
                  {blogCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant={post.featured ? "default" : "outline"} className="text-xs">
                        {post.category}
                      </Badge>
                      {post.featured && <Badge className="bg-emerald-600 text-xs">Featured</Badge>}
                      {post.language && (
                        <Badge variant="outline" className="text-xs">
                          {post.language.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-muted-foreground mb-3 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime} min read</span>
                      </div>
                      <span>By {post.author.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <Link href={`/blog/${post.slug}`} target="_blank">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/blog/${post.slug}`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFeatured(post.id)}
                      className={post.featured ? "text-emerald-600" : ""}
                    >
                      {post.featured ? "Unfeature" : "Feature"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">No posts found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedCategory !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by creating your first blog post."}
              </p>
              <Link href="/admin/blog/new">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Post
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
