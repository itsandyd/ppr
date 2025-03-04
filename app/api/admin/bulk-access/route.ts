import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { parse } from "csv-parse/sync";
import { db } from "@/lib/db";
import { sendCourseAccessEmail } from "@/lib/resend";
import crypto from "crypto";

// const ADMIN_USER_IDS = ["user_2Oy4M1qbxPKHdE3yGcQxJXxJQQJ"]; // Replace with your admin user IDs

interface UserMigrationData {
  email: string;
  name?: string;
  purchaseDate?: string;
  originalPurchaseId?: string;
}

// Generate a random 8-character code
function generateMigrationCode(): string {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // || !ADMIN_USER_IDS.includes(userId))

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const courseId = formData.get("courseId") as string;

    if (!file || !courseId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Get course details
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // Read and parse CSV file
    const fileContent = await file.text();
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as UserMigrationData[];

    let successCount = 0;
    let errorCount = 0;
    const processedEmails = new Set();

    // Process each user
    for (const record of records) {
      const { email, purchaseDate, originalPurchaseId } = record;

      // Skip if email is invalid or already processed
      if (!email || typeof email !== "string" || !email.includes("@") || processedEmails.has(email)) {
        errorCount++;
        continue;
      }

      processedEmails.add(email);

      try {
        // Generate unique migration code
        const code = generateMigrationCode();
        
        // Create migration code record
        await db.migrationCode.create({
          data: {
            code,
            email,
            courseId,
            originalPurchaseId: originalPurchaseId || null,
            originalPurchaseDate: purchaseDate ? new Date(purchaseDate) : null,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiry
          },
        });

        // Send email with migration code
        await sendCourseAccessEmail({
          recipientEmail: email,
          courseName: course.title,
          migrationCode: code,
          loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/sign-up`, // Users will enter code during checkout
        });

        successCount++;
      } catch (error) {
        console.error(`Error processing user ${email}:`, error);
        errorCount++;
      }
    }

    return NextResponse.json({
      successCount,
      errorCount,
    });
  } catch (error) {
    console.error("[BULK_ACCESS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 