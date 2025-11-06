"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useLanguage } from "@/lib/LanguageContext"

export default function ContactPage() {
  const { language, setLanguage, t } = useLanguage()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    question: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/send-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowSuccess(true)
        setFormData({ firstName: "", lastName: "", email: "", question: "" })
        setTimeout(() => setShowSuccess(false), 5000)
      } else {
        console.error("Failed to send contact form")
      }
    } catch (error) {
      console.error("Error sending contact form:", error)
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
            <Link href="/#features" className="text-sm font-medium hover:text-[#FABD18] transition-colors">
              {t("features")}
            </Link>
            <Link href="/#pricing" className="text-sm font-medium hover:text-[#FABD18] transition-colors">
              {t("pricing")}
            </Link>
            <Link href="/blog" className="text-sm font-medium hover:text-[#FABD18] transition-colors">
              {t("blog")}
            </Link>
            <Link href="/#faq" className="text-sm font-medium hover:text-[#FABD18] transition-colors">
              {t("faq")}
            </Link>
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
              onClick={() => (window.location.href = "/#pricing")}
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

      {/* Contact Form Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4" style={{ color: "#1B242B" }}>
              {t("contactTitle")}
            </h1>
            <p className="text-xl text-gray-600">{t("contactSubtitle")}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center" style={{ color: "#1B242B" }}>
                {t("getInTouch")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✅</span>
                    <span className="text-green-800 font-medium">{t("contactSuccess")}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      {t("firstName")}
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      {t("lastName")}
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {t("email")}
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                    {t("question")}
                  </label>
                  <Textarea
                    id="question"
                    name="question"
                    value={formData.question}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full"
                    placeholder={t("questionPlaceholder")}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 text-lg"
                  style={{ backgroundColor: "#FABD18", color: "#1B242B" }}
                >
                  {isSubmitting ? t("submitting") : t("submitContact")}
                </Button>
              </form>
            </CardContent>
          </Card>
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
                  <Link href="/#features" className="hover:text-white transition-colors">
                    {t("features")}
                  </Link>
                </li>
                <li>
                  <Link href="/#pricing" className="hover:text-white transition-colors">
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
              <div className="flex">
                <Input type="email" placeholder={t("enterEmail")} className="rounded-r-none" />
                <Button className="rounded-l-none" style={{ backgroundColor: "#FABD18", color: "#1B242B" }}>
                  {t("subscribe")}
                </Button>
              </div>
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
