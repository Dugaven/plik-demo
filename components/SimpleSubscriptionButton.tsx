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
    try {
      setIsLoading(true)
      const response = await fetch("/api/stripe/simple-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert("Failed to create checkout session: " + (data.error || "Unknown error"))
      }
    } catch (error: any) {
      console.error("Checkout error:", error)
      alert("Failed to start checkout: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleClick} disabled={isLoading} className={className}>
      {isLoading ? "Loading..." : children}
    </Button>
  )
}
