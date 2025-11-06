import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

// Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Changed to allow any origin for demo
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
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
      { headers: corsHeaders }
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
            { headers: corsHeaders },
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
                debug: {
                  subscriptionId: activeSubscription.id,
                  status: activeSubscription.status,
                  planId: planId,
                },
              },
              { headers: corsHeaders },
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
              { headers: corsHeaders },
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
        debug: { sessionId, customerId, email },
      },
      { headers: corsHeaders },
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
        headers: corsHeaders,
      },
    )
  }
}
