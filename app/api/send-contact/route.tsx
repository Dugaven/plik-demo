import { Resend } from "resend"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("[v0] Contact form API called")

  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("[v0] RESEND_API_KEY environment variable not found")
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const body = await request.json()
    const { firstName, lastName, email, question } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !question) {
      console.log("[v0] Contact form validation failed - missing fields")
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("[v0] Contact form validation failed - invalid email")
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    console.log("[v0] Sending contact form email via Resend from plik.ca domain")

    const emailData = {
      from: "noreply@plik.ca",
      to: "gaven@datablitz.com",
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1B242B; border-bottom: 2px solid #fabd18; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1B242B; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
            <h3 style="color: #1B242B; margin-top: 0;">Question/Message</h3>
            <p style="line-height: 1.6; white-space: pre-wrap;">${question}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; font-size: 12px; color: #6c757d;">
            <p>This message was sent from the Plik contact form at ${new Date().toLocaleString()}.</p>
          </div>
        </div>
      `,
    }

    const result = await resend.emails.send(emailData)
    console.log("[v0] Contact form email sent successfully:", result)

    return NextResponse.json({
      success: true,
      message: "Contact form submitted successfully",
    })
  } catch (error) {
    console.error("[v0] Contact form API error:", error)
    return NextResponse.json({ error: "Failed to send contact form" }, { status: 500 })
  }
}
