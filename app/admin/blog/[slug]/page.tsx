"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getBlogPostBySlugFromDB, updateBlogPost } from "@/lib/blog-data"
import type { BlogPost } from "@/lib/blog-data"

const convertUrlsToLinks = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  return text.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {part}
        </a>
      )
    }
    return part
  })
}

export default function EditBlogPost() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [language, setLanguage] = useState<"en" | "fr">("en")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    titleEn: "",
    titleFr: "",
    excerptEn: "",
    excerptFr: "",
    contentEn: "",
    contentFr: "",
    category: "",
    tags: "",
    author: "",
    readTime: "",
    featured: false,
  })

  useEffect(() => {
    const loadPost = async () => {
      try {
        const blogPost = await getBlogPostBySlugFromDB(slug)
        if (blogPost) {
          setPost(blogPost)
          setFormData({
            titleEn: blogPost.title || "",
            titleFr: blogPost.titleFr || "",
            excerptEn: blogPost.excerpt || "",
            excerptFr: blogPost.excerptFr || "",
            contentEn: blogPost.content || "",
            contentFr: blogPost.contentFr || "",
            category: blogPost.category || "",
            tags: Array.isArray(blogPost.tags) ? blogPost.tags.join(", ") : blogPost.tags || "",
            author: typeof blogPost.author === "object" ? blogPost.author.name : blogPost.author || "",
            readTime: blogPost.readTime || "",
            featured: blogPost.featured || false,
          })
        }
      } catch (error) {
        console.error("Error loading blog post:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [slug])

  const handleFileUpload = async (files: FileList) => {
    const validFiles = Array.from(files).filter((file) => {
      const isValidType = file.type.startsWith("image/") || file.type === "application/pdf"
      const isValidSize = file.size <= 500 * 1024 // 500KB limit

      if (!isValidType) {
        alert(`${file.name} is not a valid image or PDF file.`)
        return false
      }

      if (!isValidSize) {
        alert(`${file.name} is too large. Please choose files under 500KB.`)
        return false
      }

      return true
    })

    if (validFiles.length === 0) return

    setUploading(true)
    try {
      const formData = new FormData()
      validFiles.forEach((file) => formData.append("files", file))

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const { urls } = await response.json()
      console.log("[v0] Images uploaded successfully:", urls)

      setUploadedFiles((prev) => [...prev, ...validFiles])
      setUploadedImageUrls((prev) => [...prev, ...urls])
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload images. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      let mediaUpload = undefined
      if (uploadedImageUrls.length > 0) {
        const imageUrl = uploadedImageUrls[0]
        // Convert URL string to hex for bytea column storage
        mediaUpload = Array.from(new TextEncoder().encode(imageUrl))
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join("")
      }

      const updatedData = {
        post_title: language === "en" ? formData.titleEn : formData.titleFr,
        excerpt: language === "en" ? formData.excerptEn : formData.excerptFr,
        article: language === "en" ? formData.contentEn : formData.contentFr,
        category: formData.category,
        tags: formData.tags,
        author_info: formData.author,
        read_time: Number.parseInt(formData.readTime) || 5,
        featured_post: formData.featured ? "true" : "false",
        language: language, // Save which language is being edited
        ...(mediaUpload && {
          media_upload: mediaUpload, // Store as hex-encoded string for bytea column
        }),
      }

      console.log("[v0] Updating blog post:", post!.id)
      await updateBlogPost(post!.id, updatedData)
      console.log("[v0] Blog post updated successfully")
      router.push("/admin/blog")
    } catch (error) {
      console.error("Error updating blog post:", error)
      alert("Failed to update blog post. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
          <Link href="/admin/blog">
            <Button>Back to Blog Management</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="rounded-lg flex items-center justify-center p-1 bg-transparent w-14 h-[42px]">
              <img src="/logo-new.png" alt="InfluenceCA" className="h-full w-full object-contain" />
            </div>
            <span className="font-bold text-xl">InfluenceCA Admin</span>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link href="/admin/blog" className="text-sm font-medium hover:text-primary transition-colors">
              Blog Management
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm">
                Back to Site
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/admin/blog" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to Blog Management
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Edit Blog Post</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle>Edit Post Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Language toggle */}
                <div className="flex gap-2 mb-6">
                  <Button
                    type="button"
                    variant={language === "en" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLanguage("en")}
                  >
                    English
                  </Button>
                  <Button
                    type="button"
                    variant={language === "fr" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLanguage("fr")}
                  >
                    Français
                  </Button>
                </div>

                {/* Image upload section */}
                <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg">Upload Images</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                      onClick={() => document.getElementById("file-upload")?.click()}
                      onDrop={(e) => {
                        e.preventDefault()
                        if (e.dataTransfer.files) {
                          handleFileUpload(e.dataTransfer.files)
                        }
                      }}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                        className="hidden"
                      />
                      <div className="space-y-2">
                        <div className="text-gray-600">
                          {uploading ? "Uploading..." : "Click to upload or drag and drop"}
                        </div>
                        <div className="text-sm text-gray-500">PNG, JPG, PDF up to 500KB</div>
                      </div>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Uploaded Files:</h4>
                        <div className="space-y-2">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm">{file.name}</span>
                              <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                            </div>
                          ))}
                        </div>
                        {uploadedImageUrls.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Uploaded Images:</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {uploadedImageUrls.map((url, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={url || "/placeholder.svg"}
                                    alt={`Uploaded image ${index + 1}`}
                                    className="w-full h-24 object-cover rounded border"
                                    onError={(e) => {
                                      console.log("[v0] Image failed to load:", url)
                                      e.currentTarget.src = "/placeholder.svg"
                                    }}
                                    onLoad={() => console.log("[v0] Image loaded successfully:", url)}
                                  />
                                  <div className="text-xs text-gray-500 mt-1 truncate" title={url}>
                                    {url.split("/").pop()}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title ({language === "en" ? "English" : "Français"})
                  </label>
                  <Input
                    value={language === "en" ? formData.titleEn : formData.titleFr}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [language === "en" ? "titleEn" : "titleFr"]: e.target.value,
                      })
                    }
                    placeholder={language === "en" ? "Enter blog post title" : "Entrez le titre du blog"}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt ({language === "en" ? "English" : "Français"})
                  </label>
                  <Textarea
                    value={language === "en" ? formData.excerptEn : formData.excerptFr}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [language === "en" ? "excerptEn" : "excerptFr"]: e.target.value,
                      })
                    }
                    placeholder={language === "en" ? "Brief description of the post" : "Brève description du post"}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content ({language === "en" ? "English" : "Français"})
                  </label>
                  <Textarea
                    value={language === "en" ? formData.contentEn : formData.contentFr}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [language === "en" ? "contentEn" : "contentFr"]: e.target.value,
                      })
                    }
                    placeholder={
                      language === "en"
                        ? "Write your blog post content here..."
                        : "Écrivez le contenu de votre blog ici..."
                    }
                    rows={12}
                    required
                  />
                </div>

                {/* Category, tags, author fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <Input
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., Marketing"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Read Time</label>
                    <Input
                      value={formData.readTime}
                      onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                      placeholder="e.g., 5"
                      type="number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="influencer, marketing, canada"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                  <Input
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Author name"
                    required
                  />
                </div>

                {/* Featured post toggle */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    Featured Post
                  </label>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={saving} className="flex-1">
                    {saving ? "Updating..." : "Update Post"}
                  </Button>
                  <Link href="/admin/blog">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <img
                    src={uploadedImageUrls[0] || post?.image || "/placeholder.svg"}
                    alt={language === "en" ? formData.titleEn : formData.titleFr}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      console.log("[v0] Preview image failed to load:", uploadedImageUrls[0] || post?.image)
                      e.currentTarget.src = "/placeholder.svg"
                    }}
                    onLoad={() =>
                      console.log("[v0] Preview image loaded successfully:", uploadedImageUrls[0] || post?.image)
                    }
                  />
                  {uploadedImageUrls[0] && (
                    <div className="text-xs text-gray-500 mt-1">
                      Using uploaded image: {uploadedImageUrls[0].split("/").pop()}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Badge variant="secondary">{formData.category}</Badge>
                  <span>•</span>
                  <span>{formData.readTime} min read</span>
                  <span>•</span>
                  <span>
                    {post ? new Date(post.publishedAt).toLocaleDateString() : new Date().toLocaleDateString()}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  {language === "en" ? formData.titleEn : formData.titleFr}
                </h2>

                <p className="text-gray-600">{language === "en" ? formData.excerptEn : formData.excerptFr}</p>

                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-gray-800">
                    {convertUrlsToLinks(language === "en" ? formData.contentEn : formData.contentFr)}
                  </div>
                </div>

                <div className="text-sm text-gray-500">By {formData.author}</div>

                {formData.tags && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.split(",").map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
