// ecomruns.com/app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {connectDB} from '@/lib/db';
import BlogPost from '@/models/BlogPost';

export async function POST(request: NextRequest) {
  try {
    // 1. Connect to database
    await connectDB();
    
    // 2. Get content from AI tool
    const body = await request.json();
    const { title, content, category, tags } = body;
    
    // 3. Validate
    if (!title || !content) {
      return NextResponse.json({
        success: false,
        error: 'Title and content are required'
      }, { status: 400 });
    }
    
    // 4. Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
    
    // 5. Create blog post (automatically saved to database)
    const post = await BlogPost.create({
      title,
      slug,
      excerpt: content.substring(0, 160),
      content,
      category: category || 'General',
      tags: tags || [],
      status: 'published',  // ← Automatically published
      published: true,
      publishedAt: new Date(),
      readingTime: Math.ceil(content.split(/\s+/).length / 200),
      source: 'AI Content Writer',
    });
    
    // 6. Return success with post URL
    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully!',
      post: {
        id: post._id,
        title: post.title,
        slug: post.slug,
        url: `/blog/${post.slug}`,  // ← The post will appear here
      }
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Webhook error:', error);
    
    // Handle duplicate slug (add timestamp)
    if (error.code === 11000) {
      const { title, content } = await request.json();
      const newSlug = `${title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim()}-${Date.now()}`;
      
      const post = await BlogPost.create({
        title,
        slug: newSlug,
        excerpt: content.substring(0, 160),
        content,
        status: 'published',
        published: true,
        publishedAt: new Date(),
        readingTime: Math.ceil(content.split(/\s+/).length / 200),
        source: 'AI Content Writer',
      });
      
      return NextResponse.json({
        success: true,
        post: {
          id: post._id,
          title: post.title,
          slug: post.slug,
          url: `/blog/${post.slug}`,
        }
      }, { status: 201 });
    }
    
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// GET endpoint to test if webhook is working
export async function GET() {
  return NextResponse.json({ 
    success: true,
    status: 'Webhook is active!',
    message: 'Send POST requests with { title, content } to create blog posts',
    example: {
      title: 'My Blog Post',
      content: 'This is the content...',
      category: 'Tech',
      tags: ['AI', 'Technology']
    }
  });
}