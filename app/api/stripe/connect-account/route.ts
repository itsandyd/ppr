import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs";
import Stripe from 'stripe';
import { db } from '@/lib/db';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

if (!process.env.NEXT_PUBLIC_APP_URL) {
  throw new Error("NEXT_PUBLIC_APP_URL is not set");
}

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-08-16',
});

export async function POST(
  req: Request,
) {
  try {
    // Get the authenticated user from Clerk
    const { userId } = auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) {
      console.error("[STRIPE_CONNECT_ACCOUNT_ERROR] No authenticated user");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("[STRIPE_CONNECT_ACCOUNT] User data:", {
      userId,
      email: clerkUser.emailAddresses[0]?.emailAddress,
    });

    // First, find or create the user
    let user = await db.user.findFirst({
      where: {
        id: userId
      }
    });

    if (!user) {
      console.log("[STRIPE_CONNECT_ACCOUNT] Creating new user for ID:", userId);
      // Create a new user if they don't exist
      user = await db.user.create({
        data: {
          id: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress,
          name: clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : undefined,
        }
      });
    }

    if (!user.email && clerkUser.emailAddresses[0]?.emailAddress) {
      // Update user with email if it's missing
      user = await db.user.update({
        where: { id: userId },
        data: { email: clerkUser.emailAddresses[0].emailAddress }
      });
    }

    console.log("[STRIPE_CONNECT_ACCOUNT] Creating Stripe account for user:", {
      userId,
      email: user.email,
      name: user.name
    });
    
    // Create Stripe Connect account
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      email: user.email || undefined,
      business_type: 'individual',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_profile: {
        name: user.name || undefined,
        product_description: 'Digital Content Creator on PausePlayRepeat',
        url: process.env.NEXT_PUBLIC_APP_URL,
        mcc: "5734" // Computer Software Stores
      },
      settings: {
        payouts: {
          schedule: {
            interval: 'daily'
          }
        },
        payments: {
          statement_descriptor: 'PAUSEPLAYREPEAT',
          statement_descriptor_kana: 'PAUSEPLAYREPEAT',
          statement_descriptor_kanji: 'PAUSEPLAYREPEAT'
        }
      }
    }).catch(error => {
      console.error("[STRIPE_ACCOUNT_CREATE_ERROR]", {
        error: error.message,
        type: error.type,
        code: error.code,
        userId: userId,
        email: user.email
      });
      throw error;
    });

    console.log("[STRIPE_CONNECT_ACCOUNT] Finding/creating coach profile for user:", userId);

    // Find or create coach profile
    let coachProfile = await db.coachProfile.findFirst({
      where: {
        userId: user.id
      }
    });

    if (!coachProfile) {
      console.log("[STRIPE_CONNECT_ACCOUNT] Creating new coach profile");
      // Create a basic coach profile if it doesn't exist
      coachProfile = await db.coachProfile.create({
        data: {
          userId: user.id,
          category: "Pending",
          location: "Pending",
          imageSrc: "",
          basePrice: 0,
          title: "Pending",
          description: "Pending",
          discordUsername: "Pending",
          timezone: "UTC+0",
          availableDays: JSON.stringify({}),
          stripeAccountId: account.id,
          stripeAccountStatus: "pending",
        }
      });
    } else {
      console.log("[STRIPE_CONNECT_ACCOUNT] Updating existing coach profile");
      // Update existing coach profile with Stripe account ID
      await db.coachProfile.update({
        where: {
          id: coachProfile.id
        },
        data: {
          stripeAccountId: account.id,
          stripeAccountStatus: "pending"
        }
      });
    }

    // Also update the User model with the Stripe account ID for global use
    await db.user.update({
      where: {
        id: user.id
        
      },
      data: {
        stripeConnectAccountId: account.id
      }
    });

    console.log("[STRIPE_CONNECT_ACCOUNT] Creating account link");

    // Create Stripe account link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/coaching/settings`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/coaching/settings?stripe=success`,
      type: 'account_onboarding',
      collect: 'eventually_due',
    }).catch(error => {
      console.error("[STRIPE_ACCOUNT_LINK_ERROR]", {
        error: error.message,
        type: error.type,
        code: error.code,
        accountId: account.id
      });
      throw error;
    });

    console.log("[STRIPE_CONNECT_ACCOUNT] Success, returning account link");
    return NextResponse.json({ url: accountLink.url, accountId: account.id });
  } catch (error: any) {
    console.error("[STRIPE_CONNECT_ACCOUNT_ERROR]", {
      error: error.message,
      type: error.type,
      code: error.code,
      stack: error.stack
    });
    
    // Return a more specific error message
    const errorMessage = error.message || "Internal Error";
    const statusCode = error.statusCode || 500;
    
    return new NextResponse(JSON.stringify({ 
      error: errorMessage,
      code: error.code,
      type: error.type
    }), { 
      status: statusCode,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 