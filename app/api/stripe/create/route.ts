import type { NextApiRequest, NextApiResponse } from 'next';
import { createExpressAccount } from '@/lib/stripe';

interface CreateStripeAccountRequestBody {
  email: string;
}

export async function POST() {
  // try {
  //   const { email } = req.body
  //   if (!email) {
  //     return res.status(400).json({ error: 'Email is required' });
  //   }
  //   const account = await createExpressAccount(email);
  //   return res.status(200).json(account);
  // } catch (error) {
  //   console.error('Stripe account creation error:', error);
  //   return res.status(500).json({ error: 'Internal server error' });
  // }
}