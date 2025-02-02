import { db } from '@/lib/db';

export async function getCampaignCount() {
  try {
    const totalCampaigns = await db.campaign.count();
    return totalCampaigns;
  } catch (error) {
    console.error('[GET_CAMPAIGN_COUNT]', error);
    throw new Error('Failed to fetch campaign count');
  }
}