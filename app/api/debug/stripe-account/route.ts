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
    console.log("[v0] Checking Stripe account details...")

    // Get account information
    const account = await stripe.accounts.retrieve()

    // Try to retrieve the specific price IDs you provided
    const influencerPriceCheck = await stripe.prices
      .retrieve("price_1RxY9hGEdNKugi5agE4uuzkd")
      .catch((e) => ({ error: e.message }))
    const mediaPriceCheck = await stripe.prices
      .retrieve("price_1Ryw8rGEdNKugi5assE2GmIZ")
      .catch((e) => ({ error: e.message }))

    return NextResponse.json({
      account: {
        id: account.id,
        email: account.email,
        display_name: account.display_name,
        country: account.country,
      },
      secret_key_prefix: process.env.STRIPE_SECRET_KEY?.substring(0, 20) + "...",
      price_checks: {
        influencer: influencerPriceCheck,
        media: mediaPriceCheck,
      },
    })
  } catch (error: any) {
    console.error("[v0] Stripe account check failed:", error)
    return NextResponse.json(
      {
        error: error.message,
        secret_key_prefix: process.env.STRIPE_SECRET_KEY?.substring(0, 20) + "...",
      },
      { status: 500 },
    )
  }
}
