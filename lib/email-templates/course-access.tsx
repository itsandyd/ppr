import * as React from 'react';

interface CourseAccessEmailProps {
  recipientEmail: string;
  courseName: string;
  loginUrl: string;
}

export const CourseAccessEmail: React.FC<CourseAccessEmailProps> = ({
  recipientEmail,
  courseName,
  loginUrl,
}) => (
  <div>
    <h1>You&apos;ve Been Granted Access to {courseName}!</h1>
    <p>Hello {recipientEmail},</p>
    <p>
      You have been granted access to the course: <strong>{courseName}</strong>
    </p>
    <p>
      You can access your course by logging in to your account at:
      <br />
      <a href={loginUrl}>{loginUrl}</a>
    </p>
    <p>
      If you don&apos;t have an account yet, you can create one using this email address ({recipientEmail}).
    </p>
    <p>Happy learning!</p>
  </div>
); 