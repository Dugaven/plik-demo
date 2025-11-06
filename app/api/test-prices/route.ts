import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ||
    "sk_test_51RQZ9WQD4kb3METU5sIY4kiLfFFM7z6lNhUy9v4Vuc8SjkTkXz9FJwT1wFiSLusZMXyr9WygwE4ylbj1L5HEV7SK0090Mq5aOa",
  { apiVersion: "2024-06-20" },
)

export async function GET() {
  const priceIds = [
    "price_1S5TzFGEdNKugi5akKLe3ZlB", // Updated to new Stripe price ID for INFLUENCER
    "price_1Ryw8rGEdNKugi5assE2GmIZ", // INFLUENCER_MEDIA
  ]

  const results = []

  for (const priceId of priceIds) {
    try {
      const price = await stripe.prices.retrieve(priceId)
      results.push({
        priceId,
        exists: true,
        active: price.active,
        amount: price.unit_amount,
        currency: price.currency,
        product: price.product,
      })
    } catch (error) {
      results.push({
        priceId,
        exists: false,
        error: error.message,
      })
    }
  }

  return NextResponse.json({ results })
}
