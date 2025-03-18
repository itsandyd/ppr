import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import Stripe from 'stripe';
import { db } from '@/lib/db';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
});

export async function POST(
  req: Request,
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // First, find or create the user
    let user = await db.user.findFirst({
      where: {
        id: userId
      }
    });

    if (!user) {
      // Create a new user if they don't exist
      user = await db.user.create({
        data: {
          id: userId,
        }
      });
    }

    // Create Stripe Connect account
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      email: user.email || undefined, // Make email optional
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // Find or create coach profile
    let coachProfile = await db.coachProfile.findFirst({
      where: {
        userId: user.id
      }
    });

    if (!coachProfile) {
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
        }
      });
    } else {
      // Update existing coach profile with Stripe account ID
      await db.coachProfile.update({
        where: {
          id: coachProfile.id
        },
        data: {
          stripeAccountId: account.id
        }
      });
    }

    // Create Stripe account link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/coaching/settings`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/coaching/settings`,
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url, accountId: account.id });
  } catch (error) {
    console.log("[STRIPE_CONNECT_ACCOUNT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 