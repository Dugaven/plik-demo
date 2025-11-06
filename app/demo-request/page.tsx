"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function DemoRequestPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isSuccess, setIsSuccess] = useState(false)
  const [conversion, setConversion] = useState("")

  useEffect(() => {
    const success = searchParams.get("success")
    const conversionParam = searchParams.get("conversion")

    if (success === "true") {
      setIsSuccess(true)
      setConversion(conversionParam || "")
    }
  }, [searchParams])

  if (!isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>Demo Request</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              This page is for demo request confirmations. Please submit a demo request from our homepage.
            </p>
            <Button asChild style={{ backgroundColor: "#FABD18", color: "#1B242B" }}>
              <Link href="/#demo">Request Demo</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-3xl text-green-600">✅</span>
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">Demo Request Sent!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Thank you for your interest in PLIK! We've received your demo request and will get back to you within 24
            hours.
          </p>
          <p className="text-sm text-gray-500">
            Our team will contact you to schedule a personalized demo of our Canadian influencer database.
          </p>
          <div className="pt-4 space-y-3">
            <Button asChild className="w-full" style={{ backgroundColor: "#FABD18", color: "#1B242B" }}>
              <Link href="/">Return to Homepage</Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/blog">Read Our Blog</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
