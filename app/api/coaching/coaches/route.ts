import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function POST(
  request: Request, 
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { 
    category,
    location,
    imageSrc,
    price,
    title,
    description,
    discordUsername,
    discordId,
    alternativeContact,
    professionalBackground,
    certifications,
    notableProjects,
    timezone,
    available,
    availableDays,
    availableHours,
    stripeAccountId,
    acceptTerms
  } = body;

  // Required fields validation
  if (!category || !location || !imageSrc || !price || !title || !description || !discordUsername || !timezone || !acceptTerms) {
    return NextResponse.error();
  }

  // Create coach profile
  const coach = await prisma.coachProfile.create({
    data: {
      userId: currentUser.id,
      category,
      location: location?.value || '',
      imageSrc,
      basePrice: price,
      title,
      description,
      discordUsername,
      discordId: discordId || '',
      alternativeContact: alternativeContact || '',
      professionalBackground: professionalBackground || '',
      certifications: certifications || '',
      notableProjects: notableProjects || '',
      timezone,
      availableDays: availableDays || JSON.stringify(available || {}),
      availableHours: availableHours || '',
      isActive: true,
      stripeAccountId: stripeAccountId || null,
      stripeConnectComplete: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  });

  // Update user to mark as coach
  await prisma.user.update({
    where: {
      id: currentUser.id
    },
    data: {
      userTypeId: "SELLER" // Using SELLER as the user type for coaches
    }
  });

  return NextResponse.json(coach);
} 