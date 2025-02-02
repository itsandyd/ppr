'use server'

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { sendEmail } from '../../lib/promopulse/send-email';

export async function saveEmailTemplate(subject: string, content: string) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      console.error('[SAVE_EMAIL_TEMPLATE] No userId found')
      return { success: false, error: 'Unauthorized' }
    }

    // Validate inputs
    const trimmedSubject = String(subject || '').trim()
    const trimmedContent = String(content || '').trim()

    if (!trimmedSubject || !trimmedContent) {
      console.error('[SAVE_EMAIL_TEMPLATE] Missing required fields:', { 
        subject: trimmedSubject, 
        content: trimmedContent 
      })
      return { success: false, error: 'Subject and content are required' }
    }

    console.log('[SAVE_EMAIL_TEMPLATE] Creating template with:', {
      subject: trimmedSubject,
      content: trimmedContent,
      userId
    })

    // Create with explicit type casting
    const template = await db.emailTemplate.create({
      data: {
        subject: trimmedSubject,
        content: trimmedContent,
        userId: userId,
      }
    })

    console.log('[SAVE_EMAIL_TEMPLATE] Template created:', template)

    return { success: true, template }
  } catch (error) {
    console.error('[SAVE_EMAIL_TEMPLATE] Error:', {
      error,
      code: error instanceof Error ? (error as any).code : undefined,
      meta: error instanceof Error ? (error as any).meta : undefined,
    })
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to save template' 
    }
  }
}

export async function sendTestEmail(to: string, subject: string, content: string) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const result = await sendEmail(to, subject, content);

    if (!result.success) {
      throw new Error(result.error as string);
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('[SEND_TEST_EMAIL]', error);
    return { success: false, error: 'Failed to send test email' };
  }
} 