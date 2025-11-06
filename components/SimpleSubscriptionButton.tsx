"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface SimpleSubscriptionButtonProps {
  plan: "INFLUENCER" | "INFLUENCER_MEDIA"
  className?: string
  children: React.ReactNode
}

export default function SimpleSubscriptionButton({ plan, className, children }: SimpleSubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    console.log("[v0] Button clicked! Plan:", plan)
    console.log("[v0] Current URL:", window.location.href)

    try {
      setIsLoading(true)
      console.log("[v0] SimpleSubscriptionButton - Starting checkout for plan:", plan)

      console.log("[v0] Making API call to /api/stripe/simple-checkout")
      const response = await fetch("/api/stripe/simple-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      })

      console.log("[v0] API response status:", response.status)
      console.log("[v0] API response ok:", response.ok)

      const data = await response.json()
      console.log("[v0] API response data:", data)

      if (data.url) {
        console.log("[v0] Redirecting to Stripe checkout:", data.url)
        window.location.href = data.url
      } else {
        console.error("[v0] No checkout URL received:", data)
        alert("Failed to create checkout session: " + (data.error || "Unknown error"))
      }
    } catch (error) {
      console.error("[v0] Checkout error:", error)
      console.error("[v0] Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      })
      alert("Failed to start checkout: " + error.message)
    } finally {
      setIsLoading(false)
      console.log("[v0] Button loading state reset")
    }
  }

  console.log("[v0] SimpleSubscriptionButton rendered for plan:", plan)

  return (
    <Button onClick={handleClick} disabled={isLoading} className={className}>
      {isLoading ? "Loading..." : children}
    </Button>
  )
}
