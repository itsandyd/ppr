import { resend } from './resend';

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    if (!to || !subject || !html) {
      return { 
        success: false, 
        error: 'Missing required fields: to, subject, or content' 
      };
    }

    const data = await resend.emails.send({
      from: 'Promo Pulse <noreply@pauseplayrepeat.com>',
      to,
      subject,
      html,
    });

    if (!data) {
      return { 
        success: false, 
        error: 'Failed to send email: No response from email service' 
      };
    }

    console.log('Email sent successfully:', data);
    return { 
      success: true, 
      data 
    };

  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
}

