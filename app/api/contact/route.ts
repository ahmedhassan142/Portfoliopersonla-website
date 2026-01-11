import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '../../../lib/db'
import Contact from '../../../models/Contact'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const data = await request.json()
    
    // Get client IP and user agent
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    const userAgent = request.headers.get('user-agent')
    
    const contact = new Contact({
      ...data,
      ipAddress: ip,
      userAgent: userAgent,
    })
    
    await contact.save()
    
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
    )
  } catch (error) {
    console.error('Contact form error:', error)
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit contact form',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    
    const query: any = {}
    if (status) query.status = status
    
    const skip = (page - 1) * limit
    
    const [contacts, total] = await Promise.all([
      Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Contact.countDocuments(query),
    ])
    
    return NextResponse.json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch contacts',
      },
      { status: 500 }
    )
  }
}