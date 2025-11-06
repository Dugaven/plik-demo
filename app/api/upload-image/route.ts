import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const files = formData.getAll("files") as File[]
    const singleFile = formData.get("file") as File

    // Support both "file" (singular) and "files" (plural) keys
    const filesToUpload = files.length > 0 ? files : singleFile ? [singleFile] : []

    if (filesToUpload.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    console.log(
      "[v0] Uploading files:",
      filesToUpload.map((f) => f.name),
    )

    const uploadedUrls: string[] = []

    for (const file of filesToUpload) {
      // Validate file size (500KB limit)
      if (file.size > 500 * 1024) {
        return NextResponse.json(
          {
            error: `File ${file.name} is too large. Maximum size is 500KB.`,
          },
          { status: 400 },
        )
      }

      // Validate file type
      const validTypes = ["image/png", "image/jpeg", "image/jpg"]
      if (!validTypes.includes(file.type)) {
        return NextResponse.json(
          {
            error: `File ${file.name} has invalid type. Only PNG and JPG are allowed.`,
          },
          { status: 400 },
        )
      }

      const blob = await put(file.name, file, {
        access: "public",
        addRandomSuffix: true,
      })

      uploadedUrls.push(blob.url)
      console.log("[v0] Uploaded file:", file.name, "URL:", blob.url)
    }

    return NextResponse.json({
      url: uploadedUrls[0], // For single file compatibility
      urls: uploadedUrls, // For multiple files
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
