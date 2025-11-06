import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ||
    "sk_test_51RQZ9WQD4kb3METU5sIY4kiLfFFM7z6lNhUy9v4Vuc8SjkTkXz9FJwT1wFiSLusZMXyr9WygwE4ylbj1L5HEV7SK0090Mq5aOa",
  {
    apiVersion: "2024-06-20",
  },
)

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Fetching all prices from Stripe...")

    const prices = await stripe.prices.list({
      active: true,
      expand: ["data.product"],
    })

    const priceData = prices.data.map((price) => ({
      priceId: price.id,
      productId: price.product,
      productName: typeof price.product === "object" ? price.product.name : "Unknown",
      amount: price.unit_amount,
      currency: price.currency,
      interval: price.recurring?.interval || "one-time",
    }))

    console.log("[v0] Found prices:", priceData)

    return NextResponse.json({ prices: priceData })
  } catch (error) {
    console.error("[v0] Error fetching prices:", error)
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 })
  }
}
