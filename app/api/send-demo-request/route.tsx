import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  console.log("[v0] Demo request API called")

  try {
    const formData = await request.formData()

    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const phone = formData.get("phone") as string
    const message = formData.get("message") as string

    console.log("[v0] Form data received:", { firstName, lastName, email, company, phone })

    // Validate required fields
    if (!firstName || !lastName || !email || !company) {
      console.log("[v0] Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const isV0Environment =
      process.env.NODE_ENV === "development" || typeof window !== "undefined" || process.env.VERCEL_ENV === "preview"

    if (isV0Environment) {
      console.log("[v0] Running in V0/preview environment - simulating email send")
      console.log("[v0] Would send email to gaven@datablitz.com with demo request from:", firstName, lastName)

      // Simulate successful email send for V0 environment
      return NextResponse.json({
        success: true,
        message: "Demo request sent successfully (V0 simulation)",
        emailId: "v0-simulation-" + Date.now(),
      })
    }

    console.log("[v0] Checking Resend API key...")
    if (!process.env.RESEND_API_KEY) {
      console.error("[v0] RESEND_API_KEY environment variable not found")
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }
    console.log("[v0] Resend API key found, length:", process.env.RESEND_API_KEY.length)

    // Send email using Resend
    console.log("[v0] Sending email via Resend...")
    const emailData = await resend.emails.send({
      from: "Demo Requests <onboarding@resend.dev>",
      to: ["gaven@datablitz.com"],
      subject: `New Demo Request from ${firstName} ${lastName}`,
      html: `
        <h2>New Demo Request</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Message:</strong></p>
        <p>${message || "No message provided"}</p>
      `,
    })

    console.log("[v0] Email sent successfully:", emailData.data?.id)

    return NextResponse.json({
      success: true,
      message: "Demo request sent successfully",
      emailId: emailData.data?.id,
    })
  } catch (error) {
    console.error("[v0] Demo request API error:", error)
    console.error("[v0] Error message:", error instanceof Error ? error.message : "Unknown error")
    return NextResponse.json({ error: "Failed to send demo request" }, { status: 500 })
  }
}
