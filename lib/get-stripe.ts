import { type Stripe, loadStripe } from "@stripe/stripe-js"

let stripePromise: Promise<Stripe | null>

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
        "pk_test_51RQZ9WQD4kb3METU5sIY4kiLfFFM7z6lNhUy9v4Vuc8SjkTkXz9FJwT1wFiSLusZMXyr9WygwE4ylbj1L5HEV7SK00Mq5aOa",
    )
  }
  return stripePromise
}

export default getStripe
