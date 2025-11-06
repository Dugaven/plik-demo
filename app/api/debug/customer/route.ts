import Stripe from "stripe"

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ||
    "sk_test_51RQZ9WQD4kb3METU5sIY4kiLfFFM7z6lNhUy9v4Vuc8SjkTkXz9FJwT1wFiSLusZMXyr9WygwE4ylbj1L5HEV7SK0090Mq5aOa",
  {
    apiVersion: "2024-06-20",
  },
)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get("customerId")

    if (!customerId) {
      return Response.json({ error: "Customer ID required" }, { status: 400 })
    }

    // Get customer details
    const customer = await stripe.customers.retrieve(customerId)

    // Get customer's subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
    })

    // Get subscription details with price info
    const subscriptionDetails = await Promise.all(
      subscriptions.data.map(async (sub) => {
        const items = await Promise.all(
          sub.items.data.map(async (item) => {
            const price = await stripe.prices.retrieve(item.price.id)
            return {
              priceId: item.price.id,
              amount: price.unit_amount,
              currency: price.currency,
              interval: price.recurring?.interval,
            }
          }),
        )
        return {
          subscriptionId: sub.id,
          status: sub.status,
          items,
        }
      }),
    )

    return Response.json({
      customer: {
        id: customer.id,
        email: (customer as any).email,
        metadata: (customer as any).metadata,
      },
      subscriptions: subscriptionDetails,
    })
  } catch (error) {
    console.error("Debug customer error:", error)
    return Response.json({ error: "Failed to fetch customer details" }, { status: 500 })
  }
}
