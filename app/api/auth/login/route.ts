import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ||
    "sk_test_51RQZ9WQD4kb3METU5sIY4kiLfFFM7z6lNhUy9v4Vuc8SjkTkXz9FJwT1wFiSLusZMXyr9WygwE4ylbj1L5HEV7SK0090Mq5aOa",
  {
    apiVersion: "2024-06-20",
  },
)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Find customer by email
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    })

    if (customers.data.length === 0) {
      return NextResponse.json({ error: "No subscription found for this email" }, { status: 404 })
    }

    const customer = customers.data[0]

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      limit: 1,
    })

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 })
    }

    const subscription = subscriptions.data[0]

    console.log("[v0] Login - Customer ID:", customer.id)
    console.log("[v0] Login - Customer email:", customer.email)
    console.log("[v0] Login - Full customer metadata:", JSON.stringify(customer.metadata, null, 2))
    console.log("[v0] Login - Subscription ID:", subscription.id)
    console.log("[v0] Login - Subscription items:", JSON.stringify(subscription.items.data, null, 2))

    // Try to get plan from metadata first, then from subscription price
    let plan = customer.metadata?.subscription_plan || customer.metadata?.plan

    // If no plan in metadata, try to determine from subscription price
    if (!plan && subscription.items.data.length > 0) {
      const priceId = subscription.items.data[0].price.id
      console.log("[v0] Login - Price ID from subscription:", priceId)

      // Map price IDs to plans
      if (priceId === "price_1S5TzFGEdNKugi5akKLe3ZlB") {
        plan = "INFLUENCER"
      } else if (priceId === "price_1Ryw8rGEdNKugi5assE2GmIZ") {
        plan = "INFLUENCER_MEDIA"
      }
    }

    // Default to INFLUENCER if still no plan found
    plan = plan || "INFLUENCER"

    console.log("[v0] Login - Final detected plan:", plan)

    return NextResponse.json({
      email: customer.email,
      customerId: customer.id,
      subscriptionStatus: subscription.status,
      plan: plan,
      subscriptionId: subscription.id,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
