import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '../../../lib/db'
import Project from '../../../models/Project'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '12')
    const page = parseInt(searchParams.get('page') || '1')
    
    const query: any = { status: 'published' }
    if (category) query.category = category
    if (featured) query.featured = featured === 'true'
    
    const skip = (page - 1) * limit
    
    const [projects, total] = await Promise.all([
      Project.find(query)
        .sort({ featured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Project.countDocuments(query),
    ])
    
    // Increment view count (in background)
    projects.forEach(project => {
      Project.findByIdAndUpdate(project._id, {
        $inc: { 'stats.views': 1 },
      }).catch(console.error)
    })
    
    return NextResponse.json({
      success: true,
      data: projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Projects API error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch projects',
      },
      { status: 500 }
    )
  }
}