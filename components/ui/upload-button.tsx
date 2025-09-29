"use client"

import { OurFileRouter } from "@/app/api/uploadthing/core"
import { UploadButton } from "@/lib/uploadthing"



interface UploadButtonProps {
  endpoint: keyof OurFileRouter
  onClientUploadComplete?: (res: any) => void
  onUploadError?: (error: Error) => void
  className?: string
  content?: {
    button?: string
    allowedContent?: string
  }
}

export function CustomUploadButton({
  endpoint,
  onClientUploadComplete,
  onUploadError,
  className,
  content,
}: UploadButtonProps) {
  return (
    <UploadButton
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        console.log(
          "[v0] Upload complete, received URLs:",
          res?.map((r) => r.url),
        )
        if (onClientUploadComplete) {
          onClientUploadComplete(res)
        }
      }}
      onUploadError={(error) => {
        console.error("[v0] Upload error:", error)
        if (onUploadError) {
          onUploadError(error)
        }
      }}
      className={className}
      content={content}
      appearance={{
        button:
          "ut-ready:bg-emerald-500 ut-ready:hover:bg-emerald-600 ut-uploading:cursor-not-allowed bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-md transition-colors",
        allowedContent: "text-sm text-muted-foreground",
      }}
    />
  )
}
