import { Resend } from 'resend';
import { CourseAccessEmail } from './email-templates/course-access';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined');
}

const resend = new Resend(process.env.RESEND_API_KEY);

interface CourseAccessEmailProps {
  recipientEmail: string;
  courseName: string;
  loginUrl?: string;
  migrationCode?: string;
}

export const sendCourseAccessEmail = async ({
  recipientEmail,
  courseName,
  loginUrl,
  migrationCode
}: CourseAccessEmailProps) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  let emailContent = `
    <p>Hello!</p>
    
    ${migrationCode ? `
    <p>You're receiving this email because you previously purchased <strong>${courseName}</strong> on our old platform.</p>
    <p>We've upgraded our learning platform to provide you with a better experience! To access your course on the new platform:</p>
    <ol>
      <li>Visit <a href="${loginUrl}">our new platform</a> and create an account</li>
      <li>During checkout, enter this migration code: <strong>${migrationCode}</strong></li>
      <li>You'll get immediate access to your course at no additional cost</li>
    </ol>
    <p>This migration code is valid for 30 days. If you have any questions or need assistance, please reply to this email.</p>
    ` : `
    <p>You now have access to <strong>${courseName}</strong>!</p>
    <p>To start learning, <a href="${loginUrl}">click here to log in</a>.</p>
    `}
    
    <p>Happy learning!</p>
  `;

  try {
    await resend.emails.send({
      from: "Academy <academy@resend.dev>",
      to: recipientEmail,
      subject: migrationCode 
        ? `Action Required: Access Your ${courseName} Course on Our New Platform`
        : `Welcome to ${courseName}!`,
      html: emailContent,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}; 