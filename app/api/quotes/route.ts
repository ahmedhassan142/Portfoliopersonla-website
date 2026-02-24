import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Quote from '@/models/Quote';
import { sendQuoteConfirmation, sendQuoteNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const body = await request.json();
    
    // Add metadata
    const quoteData = {
      ...body,
      //@ts-ignore
      ipAddress: request.headers.get('x-forwarded-for') || request.ip,
      userAgent: request.headers.get('user-agent'),
      source: request.headers.get('referer') ? 'referral' : 'direct',
    };

    // Calculate estimated price (optional - can be done on client side)
    const estimatedPrice = calculateEstimatedPrice(body);
    quoteData.estimatedPrice = estimatedPrice;

    // Create quote in database
    const quote = await Quote.create(quoteData);

    // Send email confirmations (optional - implement later)
    try {
      await sendQuoteConfirmation(quote);
      await sendQuoteNotification(quote);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Quote request submitted successfully',
      data: {
        //@ts-ignore
        id: quote._id,
        //@ts-ignore
        estimatedPrice: quote.estimatedPrice,
        //@ts-ignore
        status: quote.status,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Quote submission error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map((err: any) => err.message),
      }, { status: 400 });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json({
        success: false,
        message: 'Duplicate submission detected',
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to submit quote request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const status = searchParams.get('status');
    
    let query: any = {};
    if (email) query.email = email;
    if (status) query.status = status;

    const quotes = await Quote.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({
      success: true,
      data: quotes,
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch quotes',
    }, { status: 500 });
  }
}

// Helper function to calculate estimated price
function calculateEstimatedPrice(data: any): number {
  const basePrices: Record<string, number> = {
    'website': 2000,
    'mobile-app': 5000,
    'web-app': 4000,
    'ai-solution': 6000,
    'ecommerce': 4500,
    'custom': 3000,
  };

  const featurePrices: Record<string, number> = {
    'responsive': 500,
    'seo': 300,
    'cms': 800,
    'payment': 1000,
    'auth': 600,
    'analytics': 700,
    'api': 500,
    'multilingual': 800,
  };

  const businessMultipliers: Record<string, number> = {
    'individual': 0.7,
    'startup': 1,
    'small': 1.2,
    'medium': 1.5,
    'enterprise': 2,
  };

  const timelineMultipliers: Record<string, number> = {
    'urgent': 1.5,
    '1-month': 1.2,
    '3-months': 1,
    '6-months': 0.9,
    'flexible': 0.8,
  };

  let price = basePrices[data.projectType] || 3000;

  // Add features
  if (data.features && Array.isArray(data.features)) {
    data.features.forEach((feature: string) => {
      price += featurePrices[feature] || 0;
    });
  }

  // Apply multipliers
  price *= businessMultipliers[data.businessSize] || 1;
  price *= timelineMultipliers[data.timeline] || 1;

  return Math.round(price);
}