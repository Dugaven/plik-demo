"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { getPostsByLanguage } from "@/lib/blog-data"
import { useLanguage } from "@/lib/LanguageContext"
import SimpleSubscriptionButton from "@/components/SimpleSubscriptionButton"

export default function HomePage() {
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recentPosts, setRecentPosts] = useState([])
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [showNewsletterSuccess, setShowNewsletterSuccess] = useState(false)

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const posts = await getPostsByLanguage(language)
        const recentPosts = posts.slice(0, 3)
        setRecentPosts(recentPosts || [])
      } catch (error) {
        console.error("Error fetching recent posts:", error)
        setRecentPosts([])
      } finally {
        setIsLoadingPosts(false)
      }
    }

    fetchRecentPosts()
  }, [language])

  const handleLearnMoreClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const featuresSection = document.getElementById("features")
    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  const handleRequestDemoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const demoSection = document.getElementById("demo")
    if (demoSection) {
      demoSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  const handleGetStartedClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const pricingSection = document.getElementById("pricing")
    if (pricingSection) {
      pricingSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/send-demo-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        if (typeof window.gtag !== "undefined") {
          window.gtag("event", "conversion", { send_to: "AW-769895361/SjOGCP-hk5MBEMHXju8C" })
        }

        window.location.href = "/demo-request?success=true&conversion=demo_submitted"
      } else {
        console.error("Failed to send email, status:", response.status)
        const errorText = await response.text()
        console.error("Error response:", errorText)
      }
    } catch (error) {
      console.error("Error sending email:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
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

  const convertUrlsToLinks = (text: string) => {
    if (!text) return text
    const urlRegex = /(https?:\/\/[^\s]+)/g
    return text.replace(
      urlRegex,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>',
    )
  }

  return (
    <div className="min-h-screen bg-white">
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
            <a href="#features" className="text-sm font-medium hover:text-[#FABD18] transition-colors">
              {t("features")}
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-[#FABD18] transition-colors">
              {t("pricing")}
            </a>
            <Link href="/blog" className="text-sm font-medium hover:text-[#FABD18] transition-colors">
              {t("blog")}
            </Link>
            <a href="#faq" className="text-sm font-medium hover:text-[#FABD18] transition-colors">
              {t("faq")}
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <Button
              size="sm"
              variant="outline"
              className="text-sm px-3 py-1 bg-transparent"
              onClick={() => (window.location.href = "/login")}
            >
              Login
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-sm px-3 py-1 bg-transparent"
              onClick={() => window.open("/api/stripe/customer-portal", "_blank")}
            >
              Manage Subscription
            </Button>
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
      <section className="relative py-20 px-4 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ minHeight: "100%", minWidth: "100%", opacity: 0.06 }}
        >
          <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/eivindjul.no_minimalist_2D_vector_illustration_of_a_central_b_ec9e0f27-66bf-4f03-a7a8-aad43791d987_0-q6CBkiQOPNL56QZlcOeWPTyNacspeF.mp4" type="video/mp4" />
        </video>

        <div className="relative z-10 container mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm">
              <div className="flex items-center space-x-2">
                <span className="text-sm">📍</span>
                <span className="text-sm font-medium text-gray-700">{t("proudlyCanadian")}</span>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl mb-6 font-extrabold" style={{ color: "#FABD18" }}>
            {t("heroTitle")}
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-slate-600 font-light">{t("heroSubtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 py-6 font-normal"
              style={{ backgroundColor: "#FABD18", color: "#1B242B" }}
              onClick={handleLearnMoreClick}
            >
              {t("learnMore")}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 border-2 bg-transparent font-normal"
              style={{ borderColor: "#FABD18", color: "#1B242B" }}
              onClick={handleRequestDemoClick}
            >
              {t("requestDemo")}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: "#1B242B" }}>
              {t("featuresTitle")}
            </h2>
            <p className="text-xl text-gray-600">{t("featuresSubtitle")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div
                  className="h-12 w-12 rounded-lg flex items-center justify-center mb-4 mx-auto"
                  style={{ backgroundColor: "#FABD18" }}
                >
                  <span className="text-2xl" style={{ color: "#1B242B" }}>
                    🛡️
                  </span>
                </div>
                <CardTitle>{t("trustedData")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{t("trustedDataDesc")}</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div
                  className="h-12 w-12 rounded-lg flex items-center justify-center mb-4 mx-auto"
                  style={{ backgroundColor: "#FABD18" }}
                >
                  <span className="text-2xl" style={{ color: "#1B242B" }}>
                    🔍
                  </span>
                </div>
                <CardTitle>{t("simplifiedSearch")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{t("simplifiedSearchDesc")}</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div
                  className="h-12 w-12 rounded-lg flex items-center justify-center mb-4 mx-auto"
                  style={{ backgroundColor: "#FABD18" }}
                >
                  <span className="text-2xl" style={{ color: "#1B242B" }}>
                    📥
                  </span>
                </div>
                <CardTitle>{t("seamlessConnections")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{t("seamlessConnectionsDesc")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: "#1B242B" }}>
              {t("pricingTitle")}
            </h2>
            <p className="text-xl text-gray-600">{t("pricingSubtitle")}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-2xl">{t("influencers")}</CardTitle>
                <div className="text-4xl font-bold" style={{ color: "#FABD18" }}>
                  $49
                  <span className="text-lg text-gray-600">/month</span>
                </div>
                <CardDescription>{t("influencersDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <span className="mr-3 text-lg font-bold" style={{ color: "#FABD18" }}>
                      ✓
                    </span>
                    {t("accessInfluencers")}
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3 text-lg font-bold" style={{ color: "#FABD18" }}>
                      ✓
                    </span>
                    {t("searchFilters")}
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3 text-lg font-bold" style={{ color: "#FABD18" }}>
                      ✓
                    </span>
                    {t("emailSupport")}
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3 text-lg font-bold" style={{ color: "#FABD18" }}>
                      ✓
                    </span>
                    {t("unlimitedCampaigns")}
                  </li>
                </ul>
                <SimpleSubscriptionButton
                  plan="INFLUENCER"
                  className="w-full"
                  style={{ backgroundColor: "#FABD18", color: "#1B242B" }}
                >
                  {t("subscribeNow")}
                </SimpleSubscriptionButton>
              </CardContent>
            </Card>
            <Card className="relative border-2" style={{ borderColor: "#FABD18" }}>
              <div
                className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: "#FABD18", color: "#1B242B" }}
              >
                {t("mostPopular")}
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">{t("influencersAndMedia")}</CardTitle>
                <div className="text-4xl font-bold" style={{ color: "#FABD18" }}>
                  $99
                  <span className="text-lg text-gray-600">/month</span>
                </div>
                <CardDescription>{t("influencersAndMediaDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <span className="mr-3 text-lg font-bold" style={{ color: "#FABD18" }}>
                      ✓
                    </span>
                    {t("accessMedia")}
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3 text-lg font-bold" style={{ color: "#FABD18" }}>
                      ✓
                    </span>
                    {t("searchFilters")}
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3 text-lg font-bold" style={{ color: "#FABD18" }}>
                      ✓
                    </span>
                    {t("prioritySupport")}
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3 text-lg font-bold" style={{ color: "#FABD18" }}>
                      ✓
                    </span>
                    {t("unlimitedCampaigns")}
                  </li>
                </ul>
                <SimpleSubscriptionButton
                  plan="INFLUENCER_MEDIA"
                  className="w-full"
                  style={{ backgroundColor: "#FABD18", color: "#1B242B" }}
                >
                  {t("subscribeNow")}
                </SimpleSubscriptionButton>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: "#1B242B" }}>
              {t("blogTitle")}
            </h2>
            <p className="text-xl text-gray-600">{t("blogSubtitle")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {isLoadingPosts ? (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">Loading blog posts...</p>
              </div>
            ) : recentPosts.length > 0 ? (
              recentPosts.map((post, index) => (
                <Card key={post.slug} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: "#FABD18", color: "#1B242B" }}
                      >
                        {post.category}
                      </span>
                      <span>{post.date}</span>
                    </div>
                    <CardTitle className="hover:text-[#FABD18] transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="text-gray-600 mb-4"
                      dangerouslySetInnerHTML={{ __html: convertUrlsToLinks(post.excerpt) }}
                    />
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center font-medium hover:text-[#FABD18] transition-colors"
                      style={{ color: "#1B242B" }}
                    >
                      {t("readMore")} →
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">No blog posts available.</p>
              </div>
            )}
          </div>
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="border-2 bg-transparent"
              style={{ borderColor: "#FABD18", color: "#1B242B" }}
            >
              <Link href="/blog">{t("viewAllPosts")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Demo Form Section */}
      <section id="demo" className="py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: "#1B242B" }}>
              {t("demoTitle")}
            </h2>
            <p className="text-xl text-gray-600 mb-2">{t("demoSubtitle")}</p>
          </div>

          <div
            className="calendly-inline-widget"
            data-url="https://calendly.com/datablitz/plik-demo?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=fabd18"
            style={{ minWidth: "320px", height: "700px" }}
          ></div>
          <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: "#1B242B" }}>
              {t("faqTitle")}
            </h2>
            <p className="text-xl text-gray-600">{t("faqSubtitle")}</p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-white rounded-lg px-6">
              <AccordionTrigger className="text-left">{t("faqQ1")}</AccordionTrigger>
              <AccordionContent>{t("faqA1")}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="bg-white rounded-lg px-6">
              <AccordionTrigger className="text-left">{t("faqQ2")}</AccordionTrigger>
              <AccordionContent>{t("faqA2")}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="bg-white rounded-lg px-6">
              <AccordionTrigger className="text-left">{t("faqQ3")}</AccordionTrigger>
              <AccordionContent>{t("faqA3")}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="bg-white rounded-lg px-6">
              <AccordionTrigger className="text-left">{t("faqQ4")}</AccordionTrigger>
              <AccordionContent>{t("faqA4")}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5" className="bg-white rounded-lg px-6">
              <AccordionTrigger className="text-left">{t("faqQ5")}</AccordionTrigger>
              <AccordionContent>{t("faqA5")}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6" className="bg-white rounded-lg px-6">
              <AccordionTrigger className="text-left">{t("faqQ6")}</AccordionTrigger>
              <AccordionContent>{t("faqA6")}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="rounded-lg flex items-center justify-center p-1 bg-transparent w-14 h-[42px]">
                  <img src="/logo-new.png" alt="InfluenceCA" className="h-full w-full object-contain" />
                </div>
                <span className="font-bold text-xl">PLIK</span>
              </div>
              <p className="text-gray-400">{t("footerCopyright")}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t("product")}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#features" className="hover:text-white transition-colors">
                    {t("features")}
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white transition-colors">
                    {t("pricing")}
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    {t("blog")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t("company")}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    {t("about")}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    {t("contact")}
                  </Link>
                </li>
                <li>
                  <Link href="https://www.datablitz.ca/privacy-policy" className="hover:text-white transition-colors">
                    {t("privacy")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t("newsletter")}</h4>
              <p className="text-gray-400 mb-4">{t("newsletterDesc")}</p>
              <form onSubmit={handleNewsletterSubmit} className="flex">
                <Input
                  type="email"
                  placeholder={t("enterEmail")}
                  className="rounded-r-none"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  className="rounded-l-none"
                  style={{ backgroundColor: "#FABD18", color: "#1B242B" }}
                  disabled={isSubscribing}
                >
                  {isSubscribing ? "..." : t("subscribe")}
                </Button>
              </form>
              {showNewsletterSuccess && (
                <div className="mt-2 p-2 bg-green-600 text-white text-sm rounded">✅ Successfully subscribed!</div>
              )}
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>{t("footerCopyright")}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
