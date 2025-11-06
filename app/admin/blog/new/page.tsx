"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Eye, Calendar, User, FileText, Globe, Upload, X, ImageIcon } from "lucide-react"
import { createBlogPost } from "@/lib/blog-data"

console.log("[v0] New blog post page is loading...")

const blogCategories = [
  "Influencer Marketing",
  "Social Media Strategy",
  "Content Creation",
  "Brand Partnerships",
  "Marketing Analytics",
  "Industry Trends",
]

export default function NewBlogPostPage() {
  console.log("[v0] NewBlogPostPage component initializing...")

  const router = useRouter()
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "fr">("en")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    en: {
      title: "",
      excerpt: "",
      content: "",
    },
    fr: {
      title: "",
      excerpt: "",
      content: "",
    },
    category: blogCategories[0],
    tags: "",
    author: {
      name: "",
      bio: "",
      avatar: "",
    },
    featured: false,
    readTime: 5,
  })

  console.log("[v0] NewBlogPostPage component state initialized successfully")

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("[v0] File upload triggered")
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter((file) => {
      const validTypes = ["image/png", "image/jpeg", "image/jpg"]
      return validTypes.includes(file.type) && file.size <= 500 * 1024 // 500KB limit
    })

    const rejectedFiles = files.filter((file) => {
      const validTypes = ["image/png", "image/jpeg", "image/jpg"]
      return !validTypes.includes(file.type) || file.size > 500 * 1024
    })

    if (rejectedFiles.length > 0) {
      alert(`${rejectedFiles.length} file(s) were rejected. Please ensure files are PNG or JPG and under 500KB.`)
    }

    if (validFiles.length > 0) {
      setIsUploading(true)
      try {
        const uploadPromises = validFiles.map(async (file) => {
          const formData = new FormData()
          formData.append("file", file)

          const response = await fetch("/api/upload-image", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`)
          }

          const result = await response.json()
          return result.url
        })

        const urls = await Promise.all(uploadPromises)
        setUploadedFiles((prev) => [...prev, ...validFiles])
        setUploadedImageUrls((prev) => [...prev, ...urls])
        console.log("[v0] Images uploaded successfully:", urls)
      } catch (error) {
        console.error("[v0] Upload error:", error)
        alert("Failed to upload images. Please try again.")
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    const validFiles = files.filter((file) => {
      const validTypes = ["image/png", "image/jpeg", "image/jpg"]
      return validTypes.includes(file.type) && file.size <= 500 * 1024 // 500KB limit
    })

    const rejectedFiles = files.filter((file) => {
      const validTypes = ["image/png", "image/jpeg", "image/jpg"]
      return !validTypes.includes(file.type) || file.size > 500 * 1024
    })

    if (rejectedFiles.length > 0) {
      alert(`${rejectedFiles.length} file(s) were rejected. Please ensure files are PNG or JPG and under 500KB.`)
    }

    if (validFiles.length > 0) {
      setIsUploading(true)
      try {
        const uploadPromises = validFiles.map(async (file) => {
          const formData = new FormData()
          formData.append("file", file)

          const response = await fetch("/api/upload-image", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`)
          }

          const result = await response.json()
          return result.url
        })

        const urls = await Promise.all(uploadPromises)
        setUploadedFiles((prev) => [...prev, ...validFiles])
        setUploadedImageUrls((prev) => [...prev, ...urls])
        console.log("[v0] Images uploaded successfully:", urls)
      } catch (error) {
        console.error("[v0] Upload error:", error)
        alert("Failed to upload images. Please try again.")
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Form submission started")
    setIsSubmitting(true)

    try {
      // Convert image URL to hex before storing (for bytea column compatibility)
      let hexEncodedImageUrl = null
      if (uploadedImageUrls.length > 0) {
        const imageUrl = uploadedImageUrls[0]
        console.log("[v0] Converting image URL to hex:", imageUrl)
        hexEncodedImageUrl = Array.from(new TextEncoder().encode(imageUrl))
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join("")
        console.log("[v0] Hex encoded image URL:", hexEncodedImageUrl)
      }

      // Prepare blog post data for Supabase
      const blogPostData = {
        post_title: formData[currentLanguage].title,
        excerpt: formData[currentLanguage].excerpt,
        article: formData[currentLanguage].content,
        author_info: formData.author.name,
        author_bio: formData.author.bio,
        category: formData.category,
        tags: formData.tags,
        read_time: formData.readTime,
        featured_post: formData.featured ? "true" : "false",
        language: currentLanguage,
        media_upload: hexEncodedImageUrl, // Store hex-encoded URL for bytea column
      }

      console.log("[v0] Attempting to create blog post:", blogPostData)
      console.log("[v0] Uploaded image URLs:", uploadedImageUrls)

      // Try to create the blog post in Supabase
      const result = await createBlogPost(blogPostData)

      if (result) {
        console.log("[v0] Blog post created successfully:", result)
        alert(`Blog post "${formData[currentLanguage].title}" created successfully!`)
        router.push("/admin/blog")
      } else {
        console.log("[v0] Supabase not configured, showing fallback message")
        alert(
          `Blog post "${formData[currentLanguage].title}" prepared successfully! (Note: Configure Supabase environment variables to save to database)`,
        )
        // Still redirect to show the form works
        router.push("/admin/blog")
      }
    } catch (error) {
      console.error("[v0] Error creating blog post:", error)
      alert("Error creating blog post. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
    setUploadedImageUrls((prev) => prev.filter((_, i) => i !== index)) // Also remove URL
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const updateLanguageContent = (field: "title" | "excerpt" | "content", value: string) => {
    setFormData({
      ...formData,
      [currentLanguage]: {
        ...formData[currentLanguage],
        [field]: value,
      },
    })
  }

  console.log("[v0] NewBlogPostPage component rendering...")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center p-1">
              <img src="/logo-new.png" alt="InfluenceCA" className="h-full w-full object-contain" />
            </div>
            <span className="font-bold text-xl">InfluenceCA Admin</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/admin/blog" className="text-sm font-medium hover:text-emerald-600 transition-colors">
              Blog Management
            </Link>
            <Link href="/" className="text-sm font-medium hover:text-emerald-600 transition-colors">
              Back to Site
            </Link>
          </nav>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              form="blog-post-form"
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-2">
        <div className="bg-blue-50 border border-blue-200 rounded p-2 text-sm text-blue-800">
          [DEBUG] New blog post page loaded successfully - Route: /admin/blog/new
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <Link href="/admin/blog">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog Management
              </Button>
            </Link>
            <h1 className="text-3xl font-black mb-2">Create New Blog Post</h1>
            <p className="text-muted-foreground">Write and publish a new article for your influencer marketing blog.</p>
          </div>

          {/* Language Toggle Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Language</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Label>Content Language:</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant={currentLanguage === "en" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentLanguage("en")}
                  >
                    English
                  </Button>
                  <Button
                    type="button"
                    variant={currentLanguage === "fr" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentLanguage("fr")}
                  >
                    Français
                  </Button>
                </div>
                <Badge variant="outline" className="text-xs">
                  Currently editing: {currentLanguage === "en" ? "English" : "French"} content
                </Badge>
              </div>
            </CardContent>
          </Card>

          <form id="blog-post-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Basic Information ({currentLanguage === "en" ? "English" : "French"})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Post Title * ({currentLanguage === "en" ? "English" : "French"})</Label>
                  <Input
                    id="title"
                    value={formData[currentLanguage].title}
                    onChange={(e) => updateLanguageContent("title", e.target.value)}
                    placeholder={
                      currentLanguage === "en"
                        ? "Enter an engaging title for your blog post"
                        : "Entrez un titre accrocheur pour votre article de blog"
                    }
                    required
                  />
                  {formData[currentLanguage].title && (
                    <p className="text-sm text-muted-foreground">
                      Slug: {generateSlug(formData[currentLanguage].title)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt * ({currentLanguage === "en" ? "English" : "French"})</Label>
                  <Textarea
                    id="excerpt"
                    value={formData[currentLanguage].excerpt}
                    onChange={(e) => updateLanguageContent("excerpt", e.target.value)}
                    placeholder={
                      currentLanguage === "en"
                        ? "Write a compelling summary that will appear in blog listings"
                        : "Rédigez un résumé convaincant qui apparaîtra dans les listes de blogs"
                    }
                    rows={3}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    {formData[currentLanguage].excerpt.length}/200 characters recommended
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      required
                    >
                      {blogCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="readTime">Read Time (minutes)</Label>
                    <Input
                      id="readTime"
                      type="number"
                      min="1"
                      max="30"
                      value={formData.readTime}
                      onChange={(e) => setFormData({ ...formData, readTime: Number.parseInt(e.target.value) || 5 })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Enter tags separated by commas (e.g., influencer marketing, ROI, trends)"
                  />
                  <p className="text-sm text-muted-foreground">Separate multiple tags with commas</p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
                  />
                  <Label htmlFor="featured">Feature this post</Label>
                  <Badge variant="outline" className="text-xs">
                    Featured posts appear prominently on the homepage
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Image Upload Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ImageIcon className="h-5 w-5" />
                  <span>Media Upload</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-medium mb-2">Upload Images</p>
                  <p className="text-sm text-muted-foreground mb-4">Drag and drop files here, or click to browse</p>
                  <input
                    type="file"
                    multiple
                    accept=".png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    disabled={isUploading} // Disable during upload
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("file-upload")?.click()}
                    disabled={isUploading} // Disable during upload
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? "Uploading..." : "Choose Files"} {/* Show upload status */}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">Supported formats: PNG, JPG (Max 500KB each)</p>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label>Uploaded Files ({uploadedFiles.length})</Label>
                    <div className="grid gap-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                          <div className="flex items-center space-x-3">
                            {uploadedImageUrls[index] ? (
                              <img
                                src={uploadedImageUrls[index] || "/placeholder.svg"}
                                alt={file.name}
                                className="w-8 h-8 object-cover rounded"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                <ImageIcon className="h-4 w-4 text-blue-600" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                              {uploadedImageUrls[index] && (
                                <p className="text-xs text-green-600">✓ Uploaded successfully</p>
                              )}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Author Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Author Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="authorName">Author Name *</Label>
                  <Input
                    id="authorName"
                    value={formData.author.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        author: { ...formData.author, name: e.target.value },
                      })
                    }
                    placeholder="Enter the author's name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authorBio">Author Bio</Label>
                  <Input
                    id="authorBio"
                    value={formData.author.bio}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        author: { ...formData.author, bio: e.target.value },
                      })
                    }
                    placeholder="Brief description of the author's expertise"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle>Content ({currentLanguage === "en" ? "English" : "French"})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="content">Article Content * ({currentLanguage === "en" ? "English" : "French"})</Label>
                  <Textarea
                    id="content"
                    value={formData[currentLanguage].content}
                    onChange={(e) => updateLanguageContent("content", e.target.value)}
                    placeholder={
                      currentLanguage === "en"
                        ? "Write your blog post content here. You can use markdown formatting."
                        : "Rédigez le contenu de votre article de blog ici. Vous pouvez utiliser le formatage markdown."
                    }
                    rows={20}
                    className="font-mono text-sm"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    {currentLanguage === "en"
                      ? "Supports basic markdown formatting (# for headers, ** for bold, * for italic, - for lists)"
                      : "Prend en charge le formatage markdown de base (# pour les en-têtes, ** pour le gras, * pour l'italique, - pour les listes)"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Preview Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Preview ({currentLanguage === "en" ? "English" : "French"})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-6 bg-slate-50">
                  <div className="flex items-center space-x-4 mb-2">
                    <Badge variant="outline">{formData.category}</Badge>
                    {formData.featured && <Badge className="bg-emerald-600">Featured</Badge>}
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    {formData[currentLanguage].title ||
                      (currentLanguage === "en"
                        ? "Your blog post title will appear here"
                        : "Le titre de votre article apparaîtra ici")}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {formData[currentLanguage].excerpt ||
                      (currentLanguage === "en" ? "Your excerpt will appear here" : "Votre extrait apparaîtra ici")}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                    <span>{formData.readTime} min read</span>
                    <span>By {formData.author.name || "Author Name"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}
