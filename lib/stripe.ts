import Stripe from "stripe"

const stripeSecretKey =
  process.env.STRIPE_SECRET_KEY ||
  "sk_test_51RQZ9WQD4kb3METU5sIY4kiLfFFM7z6lNhUy9v4Vuc8SjkTkXz9FJwT1wFiSLusZMXyr9WygwE4ylbj1L5HEV7SK0090Mq5aOa"

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is required")
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-06-20",
})

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  INFLUENCER: {
    name: "Influencer Plan",
    price: 49, // Updated price from 349 to 49 for monthly billing
    priceId: "price_1S5TzFGEdNKugi5akKLe3ZlB", // Updated to new Stripe price ID for $49/month
    productId: "prod_SuO2waw00V2rCj",
    features: ["Access to Influencer List"],
    permissions: ["influencerlist"],
  },
  INFLUENCER_MEDIA: {
    name: "Influencer and Media Plan",
    price: 99, // Updated price from 949 to 99 for monthly billing
    priceId: "price_1S5U0eGEdNKugi5aIiAXvAlg", // Updated to new Stripe price ID for $99/month
    productId: "prod_SuO2BgRiNCGRvj",
    features: ["Access to Influencer List", "Access to Media Page"],
    permissions: ["influencerlist", "media"],
  },
} as const

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS
export type Permission = "influencerlist" | "media"

// Helper function to get plan by price ID
export function getPlanByPriceId(priceId: string): SubscriptionPlan | null {
  for (const [key, plan] of Object.entries(SUBSCRIPTION_PLANS)) {
    if (plan.priceId === priceId) {
      return key as SubscriptionPlan
    }
  }
  return null
}

// Helper function to check if user has permission
export function hasPermission(userPlan: string | null, requiredPermission: Permission): boolean {
  if (!userPlan) return false

  const plan = SUBSCRIPTION_PLANS[userPlan as SubscriptionPlan]
  return plan?.permissions.includes(requiredPermission) || false
}
