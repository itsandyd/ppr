import { authMiddleware } from "@clerk/nextjs";
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextRequest, NextResponse } from 'next/server'
 
// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
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
    "/site"
  ],
  ignoredRoutes: [
    "/api/webhook/clerk", 
    "/api/webhook/stripe",
    "/api/clerk/callback",
    "/api/verify-social-action"
  ],
  async beforeAuth(auth, req) {},
  async afterAuth(auth, req) {
    //rewrite for domains
    // const url = req.nextUrl
    // const searchParams = url.searchParams.toString()
    // let hostname = req.headers

    // const pathWithSearchParams = `${url.pathname}${
    //   searchParams.length > 0 ? `?${searchParams}` : ''
    // }`

    // if subdomain exists
    // const customSubDomain = hostname
    //   .get('host')
    //   ?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
    //   .filter(Boolean)[0]

    // if (customSubDomain) {
    //   return NextResponse.rewrite(
    //     new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url)
    //   )
    // }

    // if (url.pathname === '/sign-in' || url.pathname === '/sign-up') {
    //   return NextResponse.redirect(new URL(`/agency/sign-in`, req.url))
    // }

    // if (
    //   url.pathname === '/' ||
    //   (url.pathname === '/site' && url.host === process.env.NEXT_PUBLIC_DOMAIN)
    // ) {
    //   return NextResponse.rewrite(new URL('/', req.url))
    // }

    // if (
    //   url.pathname.startsWith('/agency') ||
    //   url.pathname.startsWith('/subaccount')
    // ) {
    //   return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url))
    // }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
  unstable_allowDynamic: [
    // Allow dynamic imports from node_modules
    '/node_modules/@clerk/nextjs/**',
    '/node_modules/@supabase/**',
    '/node_modules/scheduler/**',
    '/node_modules/react-dom/**',
  ],
  runtime: 'nodejs',
}
