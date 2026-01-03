import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Testimonial from '@/models/Testimonial';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');
    const approved = searchParams.get('approved') !== 'false';
    
    const query: any = { approved };
    if (featured === 'true') query.featured = true;
    if (category) query.projectType = category;
    
    const testimonials = await Testimonial.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    
    return NextResponse.json({
      success: true,
      data: testimonials,
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const data = await request.json();
    const testimonial = new Testimonial(data);
    await testimonial.save();
    
    return NextResponse.json(
      {
        success: true,
        message: 'Testimonial submitted successfully',
        data: testimonial,
      },
      { status: 201 }
    );
    
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to submit testimonial' },
      { status: 500 }
    );
  }
}