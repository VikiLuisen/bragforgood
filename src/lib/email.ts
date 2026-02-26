import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const APP_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatCalendarDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function buildGoogleCalendarUrl(params: {
  title: string;
  start: Date;
  end: Date;
  location: string;
  description: string;
}): string {
  const url = new URL("https://www.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", params.title);
  url.searchParams.set("dates", `${formatCalendarDate(params.start)}/${formatCalendarDate(params.end)}`);
  url.searchParams.set("location", params.location);
  url.searchParams.set("details", params.description);
  return url.toString();
}

function formatEmailDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Europe/Zurich",
  });
}

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
            This link expires in 30 minutes.
          </p>
        </div>
        <p style="color: #52525b; font-size: 11px; text-align: center; margin-top: 24px;">
          You received this email because a password reset was requested for your bragforgood account.
        </p>
      </div>
    `,
  });
}

export async function sendEventJoinConfirmation(params: {
  to: string;
  userName: string;
  eventTitle: string;
  eventDate: Date;
  eventEndDate: Date | null;
  meetingPoint: string;
  whatToBring: string | null;
  deedId: string;
}) {
  const endDate = params.eventEndDate || new Date(params.eventDate.getTime() + 2 * 60 * 60 * 1000);
  const calendarUrl = buildGoogleCalendarUrl({
    title: params.eventTitle,
    start: params.eventDate,
    end: endDate,
    location: params.meetingPoint,
    description: `bragforgood event: ${APP_URL}/deeds/${params.deedId}`,
  });
  const eventUrl = `${APP_URL}/deeds/${params.deedId}`;
  const dateStr = formatEmailDate(params.eventDate);
  const endDateStr = params.eventEndDate ? formatEmailDate(params.eventEndDate) : null;

  await getResend().emails.send({
    from: "bragforgood <noreply@bragforgood.com>",
    to: params.to,
    subject: `You're in! ${params.eventTitle}`,
    html: `
      <div style="max-width: 480px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0b; color: #e4e4e7; padding: 40px 24px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: 800; margin: 0;">
            <span style="color: #34d399;">brag</span><span style="color: #e4e4e7;">forgood</span>
          </h1>
        </div>
        <div style="background-color: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 32px 24px;">
          <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 8px; text-align: center;">You're in!</h2>
          <p style="color: #a1a1aa; font-size: 14px; text-align: center; margin: 0 0 24px;">
            Hey ${escapeHtml(params.userName)}, you've signed up for:
          </p>
          <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 20px; color: #e4e4e7;">${escapeHtml(params.eventTitle)}</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #71717a; font-size: 13px; vertical-align: top; width: 24px;">&#128197;</td>
              <td style="padding: 8px 0; color: #a1a1aa; font-size: 13px;">${dateStr}${endDateStr ? ` to ${endDateStr}` : ""}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #71717a; font-size: 13px; vertical-align: top;">&#128205;</td>
              <td style="padding: 8px 0; color: #a1a1aa; font-size: 13px;">${escapeHtml(params.meetingPoint)}</td>
            </tr>
            ${params.whatToBring ? `
            <tr>
              <td style="padding: 8px 0; color: #71717a; font-size: 13px; vertical-align: top;">&#127890;</td>
              <td style="padding: 8px 0; color: #a1a1aa; font-size: 13px;"><strong style="color: #e4e4e7;">Bring:</strong> ${escapeHtml(params.whatToBring!)}</td>
            </tr>
            ` : ""}
          </table>
          <div style="margin-top: 24px; text-align: center;">
            <a href="${calendarUrl}" style="display: inline-block; background-color: #34d399; color: #0a0a0b; font-weight: 700; font-size: 14px; padding: 12px 32px; border-radius: 12px; text-decoration: none;">
              Add to Google Calendar
            </a>
          </div>
          <div style="margin-top: 16px; text-align: center;">
            <a href="${eventUrl}" style="color: #34d399; font-size: 13px; text-decoration: underline;">View event details</a>
          </div>
        </div>
        <p style="color: #52525b; font-size: 11px; text-align: center; margin-top: 24px;">
          You received this email because you signed up for an event on bragforgood.
        </p>
      </div>
    `,
  });
}
