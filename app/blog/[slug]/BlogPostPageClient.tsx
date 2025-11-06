"use client"

import { useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react"
import { getPostBySlug, getRecentPosts } from "@/lib/blog-data"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPageClient({ params }: BlogPostPageProps) {
  const [currentLanguage, setCurrentLanguage] = useState("en")

  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const recentPosts = getRecentPosts(3).filter((p) => p.id !== post.id)

  const translations = {
    en: {
      features: "Features",
      pricing: "Pricing",
      blog: "Blog",
      faq: "FAQ",
      getStarted: "Get Started",
    },
    fr: {
      features: "Fonctionnalités",
      pricing: "Tarification",
      blog: "Blog",
      faq: "FAQ",
      getStarted: "Commencer",
    },
  }

  const t = translations[currentLanguage as keyof typeof translations]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center gap-0 mx-[71px] justify-center">
          <div className="flex items-center space-x-1">
            <div className="rounded-lg flex items-center justify-center p-1 leading-7 h-[42px] bg-transparent px-1 gap-[5px] mx-0 w-14">
              <img src="/logo-new.png" alt="InfluenceCA" className="h-full w-full object-contain" />
            </div>
            <span className="font-bold text-2xl text-left" style={{ color: "#1B242B" }}>
              PLIK
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6 px-2 mx-[39px] border-0">
            <Link href="/#features" className="text-sm font-medium hover:text-[#FABD18] transition-colors">
              {t.features}
            </Link>
            <Link href="/#pricing" className="text-sm font-medium hover:text-[#FABD18] transition-colors">
              {t.pricing}
            </Link>
            <Link href="/blog" className="text-sm font-medium text-[#FABD18]">
              {t.blog}
            </Link>
            <Link href="/#faq" className="text-sm font-medium hover:text-[#FABD18] transition-colors">
              {t.faq}
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button size="sm" className="text-sm px-4 py-2" style={{ backgroundColor: "#FABD18", color: "#1B242B" }}>
              {t.getStarted}
            </Button>
            <div className="flex items-center space-x-2">
              <span className="text-lg" style={{ color: "#1B242B" }}>
                🌐
              </span>
              <button
                onClick={() => setCurrentLanguage("en")}
                className={`text-sm font-medium transition-colors ${
                  currentLanguage === "en" ? "text-[#FABD18]" : "text-gray-600 hover:text-[#FABD18]"
                }`}
              >
                EN
              </button>
              <span className="text-gray-400">|</span>
              <button
                onClick={() => setCurrentLanguage("fr")}
                className={`text-sm font-medium transition-colors ${
                  currentLanguage === "fr" ? "text-[#FABD18]" : "text-gray-600 hover:text-[#FABD18]"
                }`}
              >
                FR
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Back to Blog */}
      <div className="container mx-auto px-4 py-6">
        <Link href="/blog">
          <Button variant="ghost" className="hover:text-[#FABD18]">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <article className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Image */}
          <div className="h-96 rounded-lg mb-8 overflow-hidden">
            <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
          </div>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Badge className="bg-[#FABD18] text-black hover:bg-[#E5A916]">{post.category}</Badge>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{post.readTime} min read</span>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">{post.title}</h1>

          {/* Author */}
          <div className="flex items-center space-x-4 mb-8 pb-8 border-b">
            <img
              src={post.author.avatar || "/placeholder.svg"}
              alt={post.author.name}
              className="h-12 w-12 rounded-full"
            />
            <div>
              <div className="font-semibold">{post.author.name}</div>
              <div className="text-sm text-muted-foreground">{post.author.bio}</div>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-xl text-muted-foreground mb-8 leading-relaxed">{post.excerpt}</div>

            {/* Render markdown-style content */}
            <div
              className="space-y-6 text-foreground leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: post.content
                  .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
                  .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
                  .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mt-4 mb-2">$1</h3>')
                  .replace(/^\*\*(.*?)\*\*/gm, "<strong>$1</strong>")
                  .replace(/^\*(.*?)\*/gm, "<em>$1</em>")
                  .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
                  .replace(/\n\n/g, '</p><p class="mb-4">')
                  .replace(/^(?!<[h|l])/gm, '<p class="mb-4">')
                  .replace(/<\/p><p class="mb-4">(<[h|l])/g, "$1"),
              }}
            />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t">
            <span className="text-sm font-medium text-muted-foreground mr-2">Tags:</span>
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {recentPosts.length > 0 && (
        <section className="py-16 px-4 bg-slate-50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-black mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {recentPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow group">
                  <div className="h-32 rounded-t-lg overflow-hidden">
                    <img
                      src={relatedPost.image || "/placeholder.svg"}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <Badge variant="outline" className="mb-2 text-xs">
                      {relatedPost.category}
                    </Badge>
                    <h3 className="font-semibold mb-2 group-hover:text-[#FABD18] transition-colors">
                      <Link href={`/blog/${relatedPost.slug}`}>{relatedPost.title}</Link>
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{relatedPost.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{new Date(relatedPost.publishedAt).toLocaleDateString()}</span>
                      <span>{relatedPost.readTime} min read</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-black mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of Canadian brands using InfluenceCA to connect with the right creators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[#FABD18] hover:bg-[#E5A916] text-black">
              Start Free Trial
            </Button>
            <Link href="/#demo">
              <Button size="lg" variant="outline">
                Request Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
