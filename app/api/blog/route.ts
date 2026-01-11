import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import BlogPost from '../../../models/BlogPost';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search');
    
    const query: any = { published: true };
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const [posts, total] = await Promise.all([
      BlogPost.find(query)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-content')
        .lean(),
      BlogPost.countDocuments(query),
    ]);
    
    // Increment view count for fetched posts
    await Promise.all(
      posts.map(post =>
        BlogPost.findByIdAndUpdate(post._id, {
          $inc: { 'stats.views': 1 },
        })
      )
    );
    
    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
    
  } catch (error) {
    console.error('Blog API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const data = await request.json();
    const post = new BlogPost(data);
    await post.save();
    
    return NextResponse.json(
      {
        success: true,
        message: 'Blog post created successfully',
        data: post,
      },
      { status: 201 }
    );
    
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}