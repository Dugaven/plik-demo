"use client"

import type React from "react"

import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        console.log("[v0] Login API response:", data)
        console.log("[v0] Plan from API:", data.plan)
        console.log("[v0] Tier mapping result:", data.plan === "INFLUENCER_MEDIA" ? "premium" : "basic")

        // Store user session
        localStorage.setItem(
          "userSession",
          JSON.stringify({
            email: data.email,
            customerId: data.customerId,
            subscriptionStatus: data.subscriptionStatus,
            plan: data.plan,
          }),
        )

        const tier = data.plan === "INFLUENCER_MEDIA" ? "premium" : "basic"
        const userId = data.customerId

        console.log("[v0] Final redirect URL:", `https://app.plik.ca?tier=${tier}&userId=${userId}`)

        window.location.href = `https://app.plik.ca?tier=${tier}&userId=${userId}`
      } else {
        setError(data.error || "Login failed")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Access Your Account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Enter your email to access your subscription</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? "Checking..." : "Access Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
