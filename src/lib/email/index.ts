// Email service for AIREA
// Uses SendGrid in production

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@airea.ai';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.log('[Email] SendGrid not configured, would send:', { to, subject });
    return true; // Return true in dev for testing
  }

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: EMAIL_FROM, name: 'AIREA' },
        subject,
        content: [
          { type: 'text/plain', value: text || subject },
          { type: 'text/html', value: html },
        ],
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('[Email] Failed to send:', error);
    return false;
  }
}

// Email templates
export function welcomeEmail(name: string): { subject: string; html: string } {
  return {
    subject: 'Welcome to AIREA - Your AI Real Estate Agent',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #22c55e;">Welcome to AIREA!</h1>
        <p>Hi ${name},</p>
        <p>You're now ready to sell your home with the power of AI. Here's what you can do:</p>
        <ul>
          <li>Get an instant AI property valuation</li>
          <li>Create a professional listing in minutes</li>
          <li>Manage offers and showings from your dashboard</li>
        </ul>
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
             style="background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
            Go to Dashboard
          </a>
        </p>
        <p>Questions? Reply to this email or visit our <a href="${process.env.NEXT_PUBLIC_APP_URL}/contact">support page</a>.</p>
        <p>— The AIREA Team</p>
      </div>
    `,
  };
}

export function newOfferEmail(
  sellerName: string,
  listingAddress: string,
  offerAmount: number,
  buyerName: string
): { subject: string; html: string } {
  return {
    subject: `New Offer: $${offerAmount.toLocaleString()} on ${listingAddress}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #22c55e;">You Have a New Offer!</h1>
        <p>Hi ${sellerName},</p>
        <p>Great news! ${buyerName} has submitted an offer on your property:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Property:</strong> ${listingAddress}</p>
          <p style="margin: 10px 0 0;"><strong>Offer Amount:</strong> $${offerAmount.toLocaleString()}</p>
        </div>
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
             style="background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
            Review Offer
          </a>
        </p>
        <p>Our AI has analyzed this offer and will show you its strength score in your dashboard.</p>
        <p>— The AIREA Team</p>
      </div>
    `,
  };
}

export function showingRequestEmail(
  sellerName: string,
  listingAddress: string,
  buyerName: string,
  date: string,
  time: string
): { subject: string; html: string } {
  return {
    subject: `Showing Request for ${listingAddress}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #22c55e;">New Showing Request</h1>
        <p>Hi ${sellerName},</p>
        <p>${buyerName} would like to schedule a showing:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Property:</strong> ${listingAddress}</p>
          <p style="margin: 10px 0 0;"><strong>Date:</strong> ${date}</p>
          <p style="margin: 10px 0 0;"><strong>Time:</strong> ${time}</p>
        </div>
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
             style="background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
            Confirm or Reschedule
          </a>
        </p>
        <p>— The AIREA Team</p>
      </div>
    `,
  };
}

export function listingPublishedEmail(
  sellerName: string,
  listingAddress: string,
  listingId: string
): { subject: string; html: string } {
  return {
    subject: `Your Listing is Live: ${listingAddress}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #22c55e;">Your Listing is Live!</h1>
        <p>Hi ${sellerName},</p>
        <p>Congratulations! Your property at <strong>${listingAddress}</strong> is now live on AIREA.</p>
        <p>Your listing is being syndicated to:</p>
        <ul>
          <li>MLS</li>
          <li>Zillow</li>
          <li>Redfin</li>
          <li>100+ other real estate sites</li>
        </ul>
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/listings/${listingId}"
             style="background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
            View Your Listing
          </a>
        </p>
        <p>We'll notify you when you receive inquiries, showing requests, or offers.</p>
        <p>— The AIREA Team</p>
      </div>
    `,
  };
}
