import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { code } = await req.json();

    if (!userId || !code) {
      return new NextResponse("Unauthorized or missing code", { status: 401 });
    }

    // Find the migration code
    const migrationCode = await db.migrationCode.findFirst({
      where: {
        code: code.toUpperCase(),
        courseId: params.courseId,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!migrationCode) {
      return new NextResponse("Invalid or expired migration code", { status: 400 });
    }

    // Get user's email
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user?.email) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Verify email matches the migration code
    if (user.email.toLowerCase() !== migrationCode.email.toLowerCase()) {
      return new NextResponse("Migration code does not match your email", { status: 400 });
    }

    // Create course access
    await db.purchaseCourse.create({
      data: {
        userId,
        courseId: params.courseId,
        createdAt: migrationCode.originalPurchaseDate || new Date(),
      },
    });

    // Mark migration code as used
    await db.migrationCode.update({
      where: { id: migrationCode.id },
      data: { used: true },
    });

    return NextResponse.json({
      success: true,
      message: "Course access granted successfully",
    });
  } catch (error) {
    console.error("[COURSE_MIGRATION]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 