import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import BlogPost from '../../../models/BlogPost';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://ah770643:2H3IHP4cvAsXzhW8@cluster0.bdbqw.mongodb.net/Tech-service?retryWrites=true&w=majority&appName=Cluster0";

export async function GET(request: NextRequest) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search');
    const slug = searchParams.get('slug'); // For single post
    
    // ✅ If slug is provided, return single post
    if (slug) {
      const post = await BlogPost.findOne({ slug, published: true })
        .lean();
      
      if (!post) {
        return NextResponse.json(
          { success: false, message: 'Post not found' },
          { status: 404 }
        );
      }
      
      // Increment view count
      await BlogPost.findByIdAndUpdate(post._id, {
        $inc: { 'stats.views': 1 }
      });
      
      return NextResponse.json({
        success: true,
        data: post,
      });
    }
    
    // ✅ Build query for multiple posts
    const query: any = { published: true };
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const [posts, total] = await Promise.all([
      BlogPost.find(query)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-content') // Don't send full content in list view
        .lean(),
      BlogPost.countDocuments(query),
    ]);
    
    // Increment view counts
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
    
  } catch (error: any) {
    console.error('Blog API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// ✅ Optional: Admin POST to create posts manually
export async function POST(request: NextRequest) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const data = await request.json();
    
    // ✅ Only title and content are required
    if (!data.title || !data.content) {
      return NextResponse.json(
        { success: false, message: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    const post = new BlogPost(data);
    await post.save();
    
    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      data: post,
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}