"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { UploadButton } from "@/lib/uploadthing"

interface UploadedImage {
  url: string
  name: string
  size: number
}

interface SimpleImageUploadProps {
  value?: string
  onChange?: (url: string) => void
}

export function SimpleImageUpload({ value, onChange }: SimpleImageUploadProps) {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  console.log("[v0] SimpleImageUpload - Props:", { value, hasOnChange: !!onChange })

  useEffect(() => {
    console.log("[v0] SimpleImageUpload - useEffect:", { value, uploadedImage: !!uploadedImage })
    if (value && !uploadedImage) {
      console.log("[v0] SimpleImageUpload - Setting existing image:", value)
      setUploadedImage({
        url: value,
        name: "Existing image",
        size: 0,
      })
    }
  }, [value, uploadedImage])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>📷</span>
          Upload Image
        </CardTitle>
        <CardDescription>Upload a single image (max 4MB)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <UploadButton
          endpoint="mediaUploader"
          onClientUploadComplete={(res) => {
            console.log("Upload complete:", res)
            setIsUploading(false)
            if (res && res[0]) {
              const imageData = {
                url: res[0].url,
                name: res[0].name,
                size: res[0].size,
              }
              setUploadedImage(imageData)
              if (onChange) {
                onChange(res[0].url)
              }
            }
          }}
          onUploadError={(error) => {
            console.error("Upload error:", error)
            setIsUploading(false)
            alert(`Upload failed: ${error.message}`)
          }}
          onUploadBegin={() => {
            setIsUploading(true)
          }}
          appearance={{
            button: "bg-primary text-primary-foreground hover:bg-primary/90 w-full",
            allowedContent: "text-muted-foreground text-sm",
          }}
        />

        {isUploading && <div className="text-center text-sm text-muted-foreground">Uploading...</div>}

        {uploadedImage && (
          <div className="space-y-2">
            <img
              src={uploadedImage.url || "/placeholder.svg"}
              alt={uploadedImage.name}
              className="w-full h-48 object-cover rounded-lg border"
            />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">{uploadedImage.name}</p>
              {uploadedImage.size > 0 && <p>{(uploadedImage.size / 1024 / 1024).toFixed(2)} MB</p>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
