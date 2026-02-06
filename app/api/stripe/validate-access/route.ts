import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

const ALLOWED_ORIGINS = [
  "https://app.plik.ca",
  "https://plik.ca",
  "https://www.plik.ca",
]

function getCorsHeaders(request: NextRequest) {
  const origin = request.headers.get("origin") || ""
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(request),
  })
}

export async function POST(request: NextRequest) {
  // DEMO MODE BYPASS - Check environment variable
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

  if (isDemoMode) {
    console.log('🎭 Demo mode active - bypassing Stripe validation')
    return NextResponse.json(
      {
        valid: true,
        customerId: 'demo_customer',
        email: 'demo@plik.ca',
        planId: 'demo_plan',
        method: 'demo',
        isDemoMode: true
      },
      { headers: getCorsHeaders(request) }
    )
  }

  // NORMAL STRIPE VALIDATION (rest of original code)
  try {
    const { sessionId, customerId, email } = await request.json()

    // Method 1: Validate by session_id (for new users)
    if (sessionId) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
          expand: ["subscription", "subscription.items.data.price"],
        })

        if (session.payment_status === "paid" && session.status === "complete") {
          // Get the plan ID from the subscription
          let planId = null
          if (session.subscription && typeof session.subscription === "object") {
            const subscription = session.subscription as any
            planId = subscription.items.data[0]?.price.id
          }

          return NextResponse.json(
            {
              valid: true,
              customerId: session.customer,
              email: session.customer_details?.email,
              planId: planId,
              method: "session",
            },
            { headers: getCorsHeaders(request) },
          )
        }
      } catch (error) {
        console.log("Session validation failed:", error)
      }
    }

    // Method 2: Validate by customer info (for returning users)
    if (customerId || email) {
      try {
        let customer
        if (customerId) {
          customer = await stripe.customers.retrieve(customerId as string)
        } else if (email) {
          const customers = await stripe.customers.list({ email, limit: 1 })
          customer = customers.data[0]
        }

        if (customer) {
          const subscriptions = await stripe.subscriptions.list({
            customer: customer.id,
            status: "all",
            limit: 10,
            expand: ["data.items.data.price"],
          })

          const activeSubscription = subscriptions.data.find(
            (sub: any) => sub.status === "active" || sub.status === "trialing",
          )

          if (activeSubscription) {
            const planId = activeSubscription.items.data[0]?.price.id
            return NextResponse.json(
              {
                valid: true,
                customerId: customer.id,
                email: customer.email,
                planId: planId,
                method: "subscription",
                subscriptionStatus: activeSubscription.status,
              },
              { headers: getCorsHeaders(request) },
            )
          }

          if (customer.metadata?.subscription_status === "active") {
            return NextResponse.json(
              {
                valid: true,
                customerId: customer.id,
                email: customer.email,
                planId: customer.metadata.subscription_plan,
                method: "metadata",
              },
              { headers: getCorsHeaders(request) },
            )
          }
        }
      } catch (error) {
        console.log("Customer validation failed:", error)
      }
    }

    return NextResponse.json(
      {
        valid: false,
        error: "No valid access found",
      },
      { headers: getCorsHeaders(request) },
    )
  } catch (error) {
    console.error("Access validation error:", error)
    return NextResponse.json(
      {
        valid: false,
        error: "Validation failed",
      },
      {
        status: 500,
        headers: getCorsHeaders(request),
      },
    )
  }
}
