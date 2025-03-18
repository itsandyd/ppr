import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import Stripe from 'stripe';
import { db } from '@/lib/db';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
});

export async function GET(
  req: Request,
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.findFirst({
      where: {
        id: userId
      }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const coachProfile = await db.coachProfile.findFirst({
      where: {
        userId: user.id
      }
    });

    if (!coachProfile?.stripeAccountId) {
      return new NextResponse("No Stripe account found", { status: 404 });
    }

    const account = await stripe.accounts.retrieve(coachProfile.stripeAccountId);

    if (account.id !== coachProfile.stripeAccountId) {
      return new NextResponse("Unauthorized to access this Stripe account", { status: 403 });
    }

    return NextResponse.json({
      detailsSubmitted: account.details_submitted,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
    });
  } catch (error) {
    console.log("[STRIPE_ACCOUNT_STATUS_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 