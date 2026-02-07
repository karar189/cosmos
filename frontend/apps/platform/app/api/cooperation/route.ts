import { NextRequest, NextResponse } from 'next/server';
import { cooperationFormSchema } from '@/lib/validators';

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requests = rateLimitMap.get(ip) || [];
  const recentRequests = requests.filter((time) => now - time < RATE_LIMIT_WINDOW);

  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
}

async function addToMailchimp(email: string): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    console.error('Mailchimp credentials not configured');
    return { success: false, error: 'Configuration error' };
  }

  // Extract datacenter from API key (e.g., us1, us19)
  const datacenter = apiKey.split('-')[1];
  const url = `https://${datacenter}.api.mailchimp.com/3.0/lists/${audienceId}/members`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
        tags: ['cooperation'],
      }),
    });

    if (!response.ok) {
      const error = await response.json();

      // Check if already subscribed
      if (error.title === 'Member Exists') {
        return { success: true };
      }

      console.error('Mailchimp API error:', error);
      return { success: false, error: error.detail || 'Failed to subscribe' };
    }

    return { success: true };
  } catch (error) {
    console.error('Mailchimp request failed:', error);
    return { success: false, error: 'Network error' };
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { ok: false, message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = cooperationFormSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          ok: false,
          message: 'Invalid email address',
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email } = validation.data;
    const provider = process.env.LIST_PROVIDER || 'stub';

    // Handle based on provider
    if (provider === 'mailchimp') {
      const result = await addToMailchimp(email);

      if (!result.success) {
        return NextResponse.json(
          { ok: false, message: result.error || 'Failed to add to cooperation' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        ok: true,
        message: 'Successfully added to cooperation!',
      });
    } else {
      // Stub mode - just log and return success
      console.log(`[Cooperation] New subscriber: ${email}`);
      return NextResponse.json({
        ok: true,
        message: 'Successfully added to cooperation! (stub mode)',
      });
    }
  } catch (error) {
    console.error('Cooperation API error:', error);
    return NextResponse.json(
      { ok: false, message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Return 405 for non-POST methods
export async function GET() {
  return NextResponse.json({ ok: false, message: 'Method not allowed' }, { status: 405 });
}
