import { type NextRequest, NextResponse } from "next/server"
import { stripe, getPlanByPriceId } from "@/lib/stripe"
import { headers } from "next/headers"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")!

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    console.log(`Received Stripe webhook: ${event.type}`)

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object
        console.log(`Checkout completed for session: ${session.id}`)

        if (session.mode === "subscription") {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
          const priceId = subscription.items.data[0]?.price.id
          const planKey = getPlanByPriceId(priceId)

          if (session.customer && planKey) {
            await stripe.customers.update(session.customer as string, {
              metadata: {
                subscription_plan: planKey,
                subscription_status: "active",
                subscription_start_date: new Date(subscription.current_period_start * 1000).toISOString(),
                subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
                stripe_subscription_id: subscription.id,
              },
            })
            console.log(`Updated customer metadata for subscription: ${subscription.id}`)
          }
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object
        const priceId = subscription.items.data[0]?.price.id
        const planKey = getPlanByPriceId(priceId)

        if (planKey) {
          await stripe.customers.update(subscription.customer as string, {
            metadata: {
              subscription_plan: planKey,
              subscription_status: subscription.status,
              subscription_start_date: new Date(subscription.current_period_start * 1000).toISOString(),
              subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
              stripe_subscription_id: subscription.id,
            },
          })
          console.log(`Updated subscription status: ${subscription.status}`)
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object

        await stripe.customers.update(subscription.customer as string, {
          metadata: {
            subscription_status: "canceled",
            subscription_end_date: new Date().toISOString(),
          },
        })
        console.log(`Canceled subscription for customer: ${subscription.customer}`)
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object

        await stripe.customers.update(invoice.customer as string, {
          metadata: {
            subscription_status: "past_due",
          },
        })
        console.log(`Payment failed for customer: ${invoice.customer}`)
        break
      }

      default:
        console.log(`Unhandled webhook event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
