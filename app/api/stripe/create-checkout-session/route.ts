import { type NextRequest, NextResponse } from "next/server"
import { stripe, getPlanByPriceId } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const { priceId } = await request.json()

    if (!priceId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate price ID
    const planKey = getPlanByPriceId(priceId)
    if (!planKey) {
      return NextResponse.json({ error: "Invalid price ID" }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `https://app.plik.ca?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}?cancelled=true`,
      metadata: {
        plan_key: planKey,
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
