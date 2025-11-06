"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useStripeCheckout } from "@/hooks/useStripeCheckout"

interface CustomerPortalButtonProps {
  className?: string
  children: React.ReactNode
}

export function CustomerPortalButton({ className, children }: CustomerPortalButtonProps) {
  const { createCustomerPortalSession, isLoading } = useStripeCheckout()

  const handlePortalAccess = async () => {
    await createCustomerPortalSession()
  }

  return (
    <Button onClick={handlePortalAccess} disabled={isLoading} className={className} variant="outline">
      {isLoading ? "Loading..." : children}
    </Button>
  )
}
