import { createUploadthing, type FileRouter } from "uploadthing/next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const f = createUploadthing()

export const ourFileRouter = {
  mediaUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    pdf: { maxFileSize: "16MB", maxFileCount: 3 },
  })
    .middleware(async ({ req }) => {
      const session = await getServerSession(authOptions)
      if (!session?.user?.id) throw new Error("Unauthorized")

      return { uploadedBy: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Use file.ufsUrl instead of deprecated file.url
      return {
        uploadedBy: metadata.uploadedBy,
        url: file.ufsUrl,   // 🔹 Updated
        fileName: file.name,
        fileType: file.type,
      }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
