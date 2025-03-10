import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    // API routes that need to be public
    "/api/webhook/clerk", 
    "/api/webhook/stripe",
    "/api/clerk/callback",
    "/api/verify-social-action",
    "/api/resources",
    "/api/resources/:path*",
    "/api/leads",
    "/api/uploadthing",
    "/api/:path*",
    
    // Add Discord API to public routes
    "/api/discord/verify-username",
    "/api/coaching/setup-discord-channel",
    
    // Public pages
    "/",
    "/sounds",
    "/plugins/:path*",
    "/academy",
    "/coaching",
    "/community",
    "/music",
    "/spotify",
    "/ai/",
    "/freebies",
    "/freebies/:path*",
    "/lib/agency/queries",
    "/site",
    
    // Exclude NextAuth routes from Clerk
    "/api/auth/:path*",
    "/coaching/listings/:path*"
  ],
  ignoredRoutes: [
    "/api/webhook/clerk",
    "/api/webhook/stripe",
    "/api/clerk/callback",
    "/api/verify-social-action"
  ]
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)"
  ],
}; 