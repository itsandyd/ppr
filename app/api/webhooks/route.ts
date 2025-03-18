import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret!
      );
    } catch (error: any) {
      return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const eventType = event.type;
    
    // Handle specific events
    switch (eventType) {
      case "account.updated":
        const account = event.data.object as Stripe.Account;
        
        // Update coach profile with details
        await db.coachProfile.updateMany({
          where: {
            stripeAccountId: account.id,
          },
          data: {
            stripeAccountStatus: account.charges_enabled ? "active" : "pending",
          }
        });
        break;
        
      // Add more event handlers as needed
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.log("[WEBHOOK_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 