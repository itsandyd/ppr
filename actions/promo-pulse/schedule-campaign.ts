import { db } from '@/lib/db';

export async function scheduleCampaign(campaignId: string, date: string, time: string) {
  try {
    // Assuming you have a Campaign model in your Prisma schema
    const scheduledCampaign = await db.campaign.update({
      where: { id: campaignId },
      data: {
        date: new Date(date),
        time,
      },
    });

    return { success: true, scheduledCampaign };
  } catch (error) {
    console.error('[SCHEDULE_CAMPAIGN]', error);
    return { success: false, error: 'Failed to schedule campaign' };
  }
}