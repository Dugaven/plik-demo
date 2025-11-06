"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { XCircle } from "lucide-react"

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Your payment was cancelled. No charges have been made to your account. You can try again anytime.
          </p>
          <div className="space-y-2">
            <Button asChild className="w-full" style={{ backgroundColor: "#FABD18", color: "#1B242B" }}>
              <Link href="/#pricing">Try Again</Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <Link href="/#demo" className="text-[#FABD18] hover:underline">
              Contact our support team
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
