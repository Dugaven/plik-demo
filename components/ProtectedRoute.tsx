"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { getUserSession, hasAccess } from "@/lib/auth"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPlan: string
}

export default function ProtectedRoute({ children, requiredPlan }: ProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    const session = getUserSession()

    if (!session) {
      window.location.href = "/login"
      return
    }

    if (!hasAccess(requiredPlan)) {
      setIsAuthorized(false)
      return
    }

    setIsAuthorized(true)
  }, [requiredPlan])

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (isAuthorized === false) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need a higher subscription plan to access this page.</p>
          <a href="/customer-portal-login" className="text-blue-600 hover:underline">
            Upgrade your subscription
          </a>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
