import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Contact from '@/models/Contact';
import { sendContactConfirmation, sendAdminNotification } from '@/lib/email2';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const data = await request.json();
    
    // Get client IP and user agent
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Create contact document
    const contact = new Contact({
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      company: data.company || '',
      service: data.service,
      budget: data.budget,
      message: data.message,
      ipAddress: ip,
      userAgent: userAgent,
      status: 'new',
      createdAt: new Date(),
    });
    
    await contact.save();
    
    // Send emails asynchronously (don't await to avoid blocking response)
    Promise.allSettled([
      sendContactConfirmation(contact).catch(err => 
        console.error('Failed to send confirmation email:', err)
      ),
      sendAdminNotification(contact).catch(err => 
        console.error('Failed to send admin notification:', err)
      ),
    ]);
    
    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Contact form submitted successfully',
        data: {
          id: contact._id,
          status: contact.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit contact form',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    
    const query: any = {};
    if (status) query.status = status;
    
    const skip = (page - 1) * limit;
    
    const [contacts, total] = await Promise.all([
      Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Contact.countDocuments(query),
    ]);
    
    return NextResponse.json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch contacts',
      },
      { status: 500 }
    );
  }
}