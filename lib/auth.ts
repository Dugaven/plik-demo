// Auth utilities
import { createClient } from "@/utils/supabase/client"

export interface UserSession {
  email: string
  customerId?: string
  subscriptionStatus?: string
  plan?: string
}

export async function getUserSession(): Promise<UserSession | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !user.email) return null

  // Defaults
  let plan = 'BASIC'
  let subscriptionStatus = 'inactive'

  // If we have metadata from a previous sync or webhook
  if (user.user_metadata?.plan) {
    plan = user.user_metadata.plan
  }

  // TODO: For production, you should fetch the real status from your DB or Stripe here
  // For now we allow access if they are logged in for testing, or default to BASIC

  return {
    email: user.email,
    customerId: user.user_metadata?.stripe_customer_id,
    subscriptionStatus: subscriptionStatus,
    plan: plan
  }
}

export function hasAccess(session: UserSession | null, requiredPlan: string): boolean {
  if (!session) return false

  // Define plan hierarchy
  const planHierarchy: Record<string, number> = {
    BASIC: 0,
    INFLUENCER: 1,
    AGENCY: 2,
    // Add legacy or other mappings if needed
    premium: 1,
    INFLUENCER_MEDIA: 1
  }

  const userPlanLevel = planHierarchy[session.plan || 'BASIC'] || 0
  const requiredPlanLevel = planHierarchy[requiredPlan] || 0

  return userPlanLevel >= requiredPlanLevel
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  window.location.href = '/login'
}
