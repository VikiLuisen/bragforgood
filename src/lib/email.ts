import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const APP_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  await getResend().emails.send({
    from: "bragforgood <noreply@bragforgood.com>",
    to: email,
    subject: "Reset your password — bragforgood",
    html: `
      <div style="max-width: 480px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0b; color: #e4e4e7; padding: 40px 24px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: 800; margin: 0;">
            <span style="color: #34d399;">brag</span><span style="color: #e4e4e7;">forgood</span>
          </h1>
        </div>
        <div style="background-color: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 32px 24px; text-align: center;">
          <h2 style="font-size: 18px; font-weight: 700; margin: 0 0 12px;">Reset your password</h2>
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
            Someone requested a password reset for your account. If this was you, click the button below. If not, you can safely ignore this email.
          </p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #34d399; color: #0a0a0b; font-weight: 700; font-size: 14px; padding: 12px 32px; border-radius: 12px; text-decoration: none;">
            Reset Password
          </a>
          <p style="color: #71717a; font-size: 12px; margin-top: 24px;">
            This link expires in 1 hour.
          </p>
        </div>
        <p style="color: #52525b; font-size: 11px; text-align: center; margin-top: 24px;">
          You received this email because a password reset was requested for your bragforgood account.
        </p>
      </div>
    `,
  });
}
