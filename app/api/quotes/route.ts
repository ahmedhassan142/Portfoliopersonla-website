import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Quote from '@/models/Quote';
import { sendQuoteConfirmation, sendQuoteNotification } from '@/lib/email';

interface QuoteRequestBody {
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  businessSize?: string;
  companyName?: string;
  industry?: string;
  features?: string[];
  requirements?: string;
  budget: string;
  timeline: string;
  estimatedPrice?: number;
}

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const body = (await request.json()) as QuoteRequestBody;

    // Derive lightweight metadata (request.ip was removed in Next.js 16)
    const forwarded = request.headers.get('x-forwarded-for');
    const ipAddress = forwarded ? forwarded.split(',')[0].trim() : '';
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer');
    const source: 'direct' | 'referral' = referer ? 'referral' : 'direct';

    // Server-side price calculation (source of truth, do not trust client)
    const estimatedPrice = calculateEstimatedPrice(body);

    // Build the document
    const quoteData = {
      name: body.name,
      email: body.email,
      phone: body.phone ?? '',
      projectType: body.projectType,
      businessSize: body.businessSize ?? 'individual',
      companyName: body.companyName ?? '',
      industry: body.industry ?? '',
      features: Array.isArray(body.features) ? body.features : [],
      requirements: body.requirements ?? '',
      budget: body.budget,
      timeline: body.timeline,
      estimatedPrice,
      status: 'pending' as const,
      ipAddress,
      userAgent,
      source,
    };

    // Create quote in database (the pre-save hook assigns quoteId)
    const quote = await Quote.create(quoteData);

    // Send email confirmations (fire-and-forget — do not fail the request)
    try {
      await sendQuoteConfirmation(quote);
      await sendQuoteNotification(quote);
    } catch (emailError) {
      console.error('Quote email sending failed:', emailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Quote request submitted successfully',
        data: {
          id: quote._id,
          quoteId: quote.quoteId,
          estimatedPrice: quote.estimatedPrice,
          status: quote.status,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error('Quote submission error:', error);

    // Handle validation errors
    if (error?.name === 'ValidationError') {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: Object.values(error.errors).map((err: any) => err.message),
        },
        { status: 400 },
      );
    }

    // Handle duplicate key errors
    if (error?.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: 'Duplicate submission detected',
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit quote request',
        error: process.env.NODE_ENV === 'development' ? error?.message : undefined,
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const status = searchParams.get('status');

    const query: Record<string, string> = {};
    if (email) query.email = email;
    if (status) query.status = status;

    const quotes = await Quote.find(query).sort({ createdAt: -1 }).limit(50);

    return NextResponse.json({
      success: true,
      data: quotes,
    });
  } catch (error) {
    console.error('Quote fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch quotes',
      },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// Server-side price calculator — kept in sync with the client estimator.
// This is the authoritative price; the client value is only a preview.
// ---------------------------------------------------------------------------
function calculateEstimatedPrice(data: QuoteRequestBody): number {
  const basePrices: Record<string, number> = {
    website: 2000,
    'mobile-app': 5000,
    'web-app': 4000,
    'ai-solution': 6000,
    ecommerce: 4500,
    custom: 3000,
  };

  const featurePrices: Record<string, number> = {
    responsive: 500,
    seo: 300,
    cms: 800,
    payment: 1000,
    auth: 600,
    analytics: 700,
    api: 500,
    multilingual: 800,
  };

  const businessMultipliers: Record<string, number> = {
    individual: 0.7,
    startup: 1,
    small: 1.2,
    medium: 1.5,
    enterprise: 2,
  };

  const timelineMultipliers: Record<string, number> = {
    urgent: 1.5,
    '1-month': 1.2,
    '3-months': 1,
    '6-months': 0.9,
    flexible: 0.8,
  };

  let price = basePrices[data.projectType] ?? 3000;

  if (Array.isArray(data.features)) {
    data.features.forEach((feature) => {
      price += featurePrices[feature] ?? 0;
    });
  }

  price *= businessMultipliers[data.businessSize ?? 'individual'] ?? 1;
  price *= timelineMultipliers[data.timeline] ?? 1;

  return Math.round(price);
}
