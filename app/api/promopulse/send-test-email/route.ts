import { sendEmail } from '@/lib/promopulse/send-email'
import { NextResponse } from 'next/server'


export async function POST(req: Request) {
  const { to, subject, content } = await req.json()

  if (!to || !subject || !content) {
    return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
  }

  const result = await sendEmail(to, subject, content)

  if (result.success) {
    return NextResponse.json({ success: true, message: 'Test email sent successfully' })
  } else {
    return NextResponse.json({ success: false, error: 'Failed to send test email' }, { status: 500 })
  }
}

