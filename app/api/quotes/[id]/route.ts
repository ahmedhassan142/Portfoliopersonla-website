import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Quote from '@/models/Quote';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const quote = await Quote.findById(params.id);
    
    if (!quote) {
      return NextResponse.json({
        success: false,
        message: 'Quote not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: quote,
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch quote',
    }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const quote = await Quote.findByIdAndUpdate(
      params.id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!quote) {
      return NextResponse.json({
        success: false,
        message: 'Quote not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: quote,
    });

  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map((err: any) => err.message),
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to update quote',
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const quote = await Quote.findByIdAndDelete(params.id);
    
    if (!quote) {
      return NextResponse.json({
        success: false,
        message: 'Quote not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Quote deleted successfully',
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to delete quote',
    }, { status: 500 });
  }
}