"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import type { SUBSCRIPTION_PLANS } from "@/lib/stripe"

interface SubscriptionButtonProps {
  plan: keyof typeof SUBSCRIPTION_PLANS
  className?: string
  children: React.ReactNode
}

export function SubscriptionButton({ plan, className, children }: SubscriptionButtonProps) {
  const router = useRouter()

  const handleSubscribe = () => {
    console.log("[v0] SubscriptionButton - Selected plan:", plan)
    localStorage.setItem("selectedPlan", plan)
    router.push("/auth/signup")
  }

  return (
    <Button onClick={handleSubscribe} className={className} style={{ backgroundColor: "#FABD18", color: "#1B242B" }}>
      {children}
    </Button>
  )
}
