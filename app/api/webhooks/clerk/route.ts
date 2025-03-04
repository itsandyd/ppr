import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, ...attributes } = evt.data;
    const primaryEmail = email_addresses?.[0]?.email_address;

    if (primaryEmail) {
      try {
        // Find existing user by email
        const existingUser = await db.user.findUnique({
          where: { email: primaryEmail }
        });

        if (existingUser) {
          // Update the existing user with Clerk ID
          await db.user.update({
            where: { email: primaryEmail },
            data: {
              id: id as string, // Update with Clerk user ID
              emailVerified: new Date(),
              // Update other relevant fields from Clerk
            }
          });

          // Update all PurchaseCourse records with the new user ID
          await db.purchaseCourse.updateMany({
            where: { userId: existingUser.id },
            data: { userId: id as string }
          });

          console.log(`Connected Clerk user ${id} with existing user ${existingUser.id}`);
        } else {
          // Create new user if they don't exist
          await db.user.create({
            data: {
              id: id as string,
              email: primaryEmail,
              emailVerified: new Date(),
              // Add other relevant fields from Clerk
            }
          });
        }
      } catch (error) {
        console.error('Error processing Clerk webhook:', error);
        return new Response('Error processing webhook', { status: 500 });
      }
    }
  }

  return NextResponse.json({ success: true });
} 