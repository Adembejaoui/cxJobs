import { createRouteHandler } from "uploadthing/next"
import { ourFileRouter } from "./core"

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    // Optional: Add custom configuration
    callbackUrl: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/uploadthing`,
  },
})
