import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    // API routes
    "/api/webhook/clerk", 
    "/api/webhook/stripe",
    "/api/clerk/callback",
    "/api/verify-social-action",
    "/api/resources",
    "/api/resources/:path*",
    "/api/leads",
    "/api/uploadthing",
    "/api/uploadthing/:path*",

    // Discord API endpoints
    "/api/discord/verify-username",
    "/api/coaching/setup-discord-channel",
    "/api/user/update-discord",  // Legacy endpoint for backward compatibility
    
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
    
    // Auth callback routes
    "/signin",
    "/signup",
    "/sso-callback"
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
