// Simple auth utilities for Stripe-based authentication
export interface UserSession {
  email: string
  customerId: string
  subscriptionStatus: string
  plan: string
}

export function getUserSession(): UserSession | null {
  if (typeof window === "undefined") return null

  const session = localStorage.getItem("userSession")
  return session ? JSON.parse(session) : null
}

export function clearUserSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("userSession")
  }
}

export function hasAccess(requiredPlan: string): boolean {
  const session = getUserSession()
  if (!session || session.subscriptionStatus !== "active") return false

  // Define plan hierarchy
  const planHierarchy = {
    BASIC: 0,
    INFLUENCER: 1,
    AGENCY: 2,
  }

  const userPlanLevel = planHierarchy[session.plan as keyof typeof planHierarchy] || 0
  const requiredPlanLevel = planHierarchy[requiredPlan as keyof typeof planHierarchy] || 0

  return userPlanLevel >= requiredPlanLevel
}
