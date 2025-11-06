"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [isLoading, setIsLoading] = useState(true)
  const [sessionData, setSessionData] = useState<any>(null)

  useEffect(() => {
    if (sessionId) {
      setIsLoading(false)
      setSessionData({ success: true })
      localStorage.removeItem("selectedPlan")
      // Just redirect with session_id - let app.plik.ca handle validation
      setTimeout(() => {
        window.location.href = `https://app.plik.ca?session_id=${sessionId}`
      }, 3000)
    }
  }, [sessionId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FABD18] mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your subscription...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Thank you for subscribing to PLIK! Your subscription has been activated and you now have access to your
            selected features.
          </p>
          <div className="space-y-2">
            <Button asChild className="w-full" style={{ backgroundColor: "#FABD18", color: "#1B242B" }}>
              <Link href={`https://app.plik.ca?session_id=${sessionId}`}>Go to PLIK App</Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            You will be automatically redirected to the PLIK app in 3 seconds, or click the button above.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
