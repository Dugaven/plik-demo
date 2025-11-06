import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    })

    if (customers.data.length === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    const customer = customers.data[0]

    // Return subscription information from Stripe customer metadata
    return NextResponse.json({
      subscription_status: customer.metadata.subscription_status || "inactive",
      subscription_plan: customer.metadata.subscription_plan || null,
      subscription_start_date: customer.metadata.subscription_start_date || null,
      subscription_end_date: customer.metadata.subscription_end_date || null,
      trial_end_date: customer.metadata.trial_end_date || null,
    })
  } catch (error) {
    console.error("Get subscription error:", error)
    return NextResponse.json({ error: "Failed to get subscription" }, { status: 500 })
  }
}
