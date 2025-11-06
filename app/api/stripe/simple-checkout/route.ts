import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ||
    "sk_test_51RQZ9WQD4kb3METU5sIY4kiLfFFM7z6lNhUy9v4Vuc8SjkTkXz9FJwT1wFiSLusZMXyr9WygwE4ylbj1L5HEV7SK0090Mq5aOa",
  { apiVersion: "2024-06-20" },
)

const PLANS = {
  INFLUENCER: {
    priceId: "price_1S5TzFGEdNKugi5akKLe3ZlB", // Updated to new Stripe price ID for $49/month
    name: "Influencer Plan",
    amount: 4900, // Updated amount from 34900 to 4900 ($49.00)
  },
  INFLUENCER_MEDIA: {
    priceId: "price_1S5U0eGEdNKugi5aIiAXvAlg", // Updated to new Stripe price ID for $99/month
    name: "Influencer and Media Plan",
    amount: 9900, // Updated amount from 94900 to 9900 ($99.00)
  },
}

export async function POST(request: NextRequest) {
  try {
    const { plan } = await request.json()

    console.log("[v0] Simple checkout - Plan:", plan)

    if (!plan || !PLANS[plan as keyof typeof PLANS]) {
      console.error("[v0] Invalid plan provided:", plan)
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const selectedPlan = PLANS[plan as keyof typeof PLANS]
    console.log("[v0] Selected plan details:", selectedPlan)

    try {
      // Validate that the price exists in Stripe
      const price = await stripe.prices.retrieve(selectedPlan.priceId)
      console.log("[v0] Price validation successful:", price.id, price.active)

      if (!price.active) {
        console.error("[v0] Price is not active:", selectedPlan.priceId)
        return NextResponse.json({ error: "Selected plan is not available" }, { status: 400 })
      }
    } catch (priceError) {
      console.error("[v0] Price validation failed:", priceError)
      return NextResponse.json({ error: "Invalid price ID" }, { status: 400 })
    }

    console.log("[v0] Creating checkout session with price:", selectedPlan.priceId)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: selectedPlan.priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `https://app.plik.ca?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}?cancelled=true`,
      allow_promotion_codes: true,
      automatic_tax: {
        enabled: true,
      },
      billing_address_collection: "required",
      metadata: {
        plan_key: plan,
      },
      customer_email: undefined, // Let Stripe collect email during checkout
    })

    console.log("[v0] Simple checkout session created successfully:", session.id)

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error("[v0] Simple checkout error details:", {
      message: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode,
    })
    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
