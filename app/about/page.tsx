"use client"
import Link from "next/link"
import { useLanguage } from "@/lib/LanguageContext"

export default function AboutPage() {
  const { language, setLanguage, t } = useLanguage()

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
            <Link href="/" className="text-sm font-medium hover:text-[#FABD18] transition-colors">
              {t("backToHome")}
            </Link>
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

      {/* About Content */}
      <main className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl mb-6 font-extrabold" style={{ color: "#FABD18" }}>
              {t("aboutTitle")}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("aboutSubtitle")}</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-gray-50 rounded-lg p-8 mb-12">
              <p className="text-lg leading-relaxed text-gray-700 mb-6">{t("aboutIntro1")}</p>

              <p className="text-lg leading-relaxed text-gray-700">{t("aboutIntro2")}</p>
            </div>

            <h2 className="text-3xl font-bold mb-6" style={{ color: "#1B242B" }}>
              {t("strategicPartnership")}
            </h2>

            <p className="text-lg leading-relaxed text-gray-700 mb-8">{t("aboutPartnership")}</p>

            <div className="bg-white border-l-4 border-[#FABD18] p-6 mb-8">
              <blockquote className="text-lg italic text-gray-700 mb-4">"{t("carolineQuote")}"</blockquote>
              <cite className="text-sm font-semibold" style={{ color: "#1B242B" }}>
                {t("carolineAttribution")}
              </cite>
            </div>

            <div className="bg-white border-l-4 border-[#FABD18] p-6 mb-8">
              <blockquote className="text-lg italic text-gray-700 mb-4">"{t("joannQuote")}"</blockquote>
              <cite className="text-sm font-semibold" style={{ color: "#1B242B" }}>
                {t("joannAttribution")}
              </cite>
            </div>

            <h2 className="text-3xl font-bold mb-6" style={{ color: "#1B242B" }}>
              {t("ourCompanies")}
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4" style={{ color: "#1B242B" }}>
                  {t("clubDePresse")}
                </h3>
                <p className="text-gray-700 leading-relaxed">{t("clubDePresseDesc")}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4" style={{ color: "#1B242B" }}>
                  {t("plikCompany")}
                </h3>
                <p className="text-gray-700 leading-relaxed">{t("plikCompanyDesc")}</p>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-lg transition-colors"
                style={{ backgroundColor: "#FABD18", color: "#1B242B" }}
              >
                {t("explorePlatform")}
              </Link>
            </div>
          </div>
        </div>
      </main>

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
