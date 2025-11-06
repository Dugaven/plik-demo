"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type React from "react"
import { useState, useEffect } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { blogCategories } from "@/lib/blog-data"
import { useLanguage } from "@/lib/LanguageContext"

export default function BlogPage() {
  const { language, setLanguage, t } = useLanguage()
  const [allPosts, setAllPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [showNewsletterSuccess, setShowNewsletterSuccess] = useState(false)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Import the new language-specific functions
        const { getPostsByLanguage, getFeaturedPostsByLanguage } = await import("@/lib/blog-data")
        const posts = await getPostsByLanguage(language)
        setAllPosts(posts || [])
      } catch (error) {
        console.error("Error fetching posts:", error)
        setAllPosts([])
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [language]) // Added language dependency to refetch when language changes

  const featuredPosts = allPosts.filter(
    (post) => (post.featured_post === "true" || post.featured_post === true) && post.language === language,
  )
  const recentPosts = allPosts
    .filter((post) => post.featured_post !== "true" && post.featured_post !== true && post.language === language)
    .slice(0, 6)

  const handleGetStartedClick = (e: React.MouseEvent) => {
    e.preventDefault()
    window.location.href = "/#pricing"
  }

  const getImageUrl = (post: any) => {
    console.log("[v0] Post image:", post.image)
    console.log("[v0] Post image type:", typeof post.image)

    // Check if we have a valid data URL (starts with data:) or a real image path
    if (
      post.image &&
      typeof post.image === "string" &&
      (post.image.startsWith("data:") || !post.image.includes("placeholder.svg"))
    ) {
      console.log("[v0] Using processed image from database")
      return post.image
    }

    const fallback = "/placeholder.svg?height=400&width=600"
    console.log("[v0] Using fallback image:", fallback)
    return fallback
  }

  const convertUrlsToLinks = (text: string) => {
    if (!text) return text
    const urlRegex = /(https?:\/\/[^\s]+)/g
    return text.replace(
      urlRegex,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>',
    )
  }

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail) return

    setIsSubscribing(true)
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newsletterEmail }),
      })

      if (response.ok) {
        setShowNewsletterSuccess(true)
        setNewsletterEmail("")
        setTimeout(() => setShowNewsletterSuccess(false), 5000)

        if (typeof window.gtag !== "undefined") {
          window.gtag("event", "conversion", { send_to: "AW-769895361/SjOGCP-hk5MBEMHXju8C" })
        }
      } else {
        console.error("Failed to subscribe to newsletter")
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error)
    } finally {
      setIsSubscribing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FABD18] mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading blog posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center gap-0 mx-[71px] justify-center">
          <Link href="/" className="flex items-center space-x-1">
            <div className="rounded-lg flex items-center justify-center p-1 leading-7 h-[42px] bg-transparent px-1 gap-[5px] mx-0 w-14">
              <img src="/logo-new.png" alt="InfluenceCA" className="h-full w-full object-contain" />
            </div>
            <span className="font-bold text-2xl text-left" style={{ color: "#1B242B" }}>
              PLIK
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 px-2 mx-[39px] border-0">
            <Link href="/#features" className="text-sm font-medium hover:text-[#FABD18] transition-colors">
              {t("features")}
            </Link>
            <Link href="/#pricing" className="text-sm font-medium hover:text-[#FABD18] transition-colors">
              {t("pricing")}
            </Link>
            <Link href="/blog" className="text-sm font-medium text-[#FABD18]">
              {t("blog")}
            </Link>
            <Link href="/#faq" className="text-sm font-medium hover:text-[#FABD18] transition-colors">
              {t("faq")}
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button
              size="sm"
              className="text-sm px-4 py-2"
              style={{ backgroundColor: "#FABD18", color: "#1B242B" }}
              onClick={handleGetStartedClick}
            >
              {t("getStarted")}
            </Button>
            <div className="flex items-center space-x-2">
              <span className="text-lg" style={{ color: "#1B242B" }}>
                🌐
              </span>
              <button
                onClick={() => setLanguage("en")}
                className={`text-sm font-medium transition-colors ${
                  language === "en" ? "text-[#FABD18]" : "text-gray-600 hover:text-[#FABD18]"
                }`}
              >
                EN
              </button>
              <span className="text-gray-400">|</span>
              <button
                onClick={() => setLanguage("fr")}
                className={`text-sm font-medium transition-colors ${
                  language === "fr" ? "text-[#FABD18]" : "text-gray-600 hover:text-[#FABD18]"
                }`}
              >
                FR
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-black mb-6">{t("blogPageTitle")}</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">{t("blogPageSubtitle")}</p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge
              variant="default"
              className="text-white cursor-pointer transition-colors"
              style={{ backgroundColor: "#FABD18" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#E5A916")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#FABD18")}
            >
              {t("allPosts")}
            </Badge>
            {blogCategories.map((category) => (
              <Badge
                key={category}
                variant="outline"
                className="cursor-pointer transition-colors"
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#FABD18")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-black mb-8" style={{ color: "#1B242B" }}>
              {t("featuredArticles")}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow group">
                  <div className="h-64 rounded-t-lg overflow-hidden">
                    <img
                      src={getImageUrl(post) || "/placeholder.svg?height=400&width=600"}
                      alt={post.post_title || post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(post.created_at || post.publishedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {post.read_time || post.readTime} {t("minRead")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <CardTitle
                      className="text-2xl transition-colors"
                      style={{ color: "#1B242B" }}
                      onMouseEnter={(e) => (e.target.style.color = "#FABD18")}
                      onMouseLeave={(e) => (e.target.style.color = "#1B242B")}
                    >
                      {post.post_title || post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="text-muted-foreground mb-4"
                      dangerouslySetInnerHTML={{ __html: convertUrlsToLinks(post.excerpt) }}
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={post.author?.avatar || "/placeholder.svg"}
                          alt={post.author_info || post.author?.name || "Author"}
                          className="h-8 w-8 rounded-full"
                        />
                        <span className="text-sm font-medium">{post.author_info || post.author?.name || "Author"}</span>
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="transition-colors"
                          onMouseEnter={(e) => (e.target.style.color = "#FABD18")}
                          onMouseLeave={(e) => (e.target.style.color = "inherit")}
                        >
                          {t("readMore")} <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-black mb-8" style={{ color: "#1B242B" }}>
            {t("recentArticles")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <Card key={post.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow group">
                <div className="h-48 rounded-t-lg overflow-hidden">
                  <img
                    src={getImageUrl(post) || "/placeholder.svg?height=400&width=600"}
                    alt={post.post_title || post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{post.category}</Badge>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{post.read_time || post.readTime} min</span>
                    </div>
                  </div>
                  <CardTitle
                    className="text-xl transition-colors"
                    style={{ color: "#1B242B" }}
                    onMouseEnter={(e) => (e.target.style.color = "#FABD18")}
                    onMouseLeave={(e) => (e.target.style.color = "#1B242B")}
                  >
                    {post.post_title || post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="text-muted-foreground mb-4 text-sm"
                    dangerouslySetInnerHTML={{ __html: convertUrlsToLinks(post.excerpt) }}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.created_at || post.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="transition-colors"
                        onMouseEnter={(e) => (e.target.style.color = "#FABD18")}
                        onMouseLeave={(e) => (e.target.style.color = "inherit")}
                      >
                        {t("read")} <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-black mb-4">{t("stayUpdated")}</h2>
          <p className="text-xl text-muted-foreground mb-8">{t("newsletterDesc")}</p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t("enterEmail")}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: "#d1d5db" }}
              onFocus={(e) => (e.target.style.borderColor = "#FABD18")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="text-white transition-colors"
              style={{ backgroundColor: "#FABD18" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#E5A916")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#FABD18")}
              disabled={isSubscribing}
            >
              {isSubscribing ? "..." : t("subscribe")}
            </Button>
          </form>
          {showNewsletterSuccess && (
            <div className="mt-4 p-3 bg-green-600 text-white text-sm rounded-lg">
              ✅ Successfully subscribed to our newsletter!
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
