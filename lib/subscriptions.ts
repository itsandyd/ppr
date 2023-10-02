import { auth } from "@clerk/nextjs";

import { db } from "./db";

const DAY_IN_MS = 86_400_000;   

export const checkSubscription = async () => {
    const { userId } = await auth();

    if (!userId) {
        return;
    }

    const userSubscription = await db?.userSubscription.findUnique({
        where: {
            userId: userId,
        },
        select: {
            stripeCurrentPeriodEnd: true,
            stripeCustomerId: true,
            stripePriceId: true,
            stripeSubscriptionId: true,
        }
    });

    if (!userSubscription) {
        return;
    }

    const isValid = userSubscription.stripePriceId && userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

    return !! isValid;
};