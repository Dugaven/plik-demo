import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      // Redirect to a form where users can enter their email
      return NextResponse.redirect(new URL("/customer-portal-login", request.url))
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

    // Create customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${request.nextUrl.origin}`,
    })

    return NextResponse.redirect(session.url)
  } catch (error) {
    console.error("Customer portal error:", error)
    return NextResponse.json({ error: "Failed to create customer portal session" }, { status: 500 })
  }
}

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

    // Create customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${request.nextUrl.origin}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Customer portal error:", error)
    return NextResponse.json({ error: "Failed to create customer portal session" }, { status: 500 })
  }
}
