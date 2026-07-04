// target-website/app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {connectDB} from '@/lib/db';
import BlogPost from '@/models/BlogPost';

export async function POST(request: NextRequest) {
  try {
    // 1. Connect to database
    await connectDB();
    
    // 2. Get the content from request
    const body = await request.json();
    const { 
      title, 
      content, 
      source = 'AI Content Writer',
      metadata = {},
      tags = [],
      category = 'General',
      excerpt = null,
      featured = false,
    } = body;
    
    // 3. Validate required fields
    if (!title || !content) {
      return NextResponse.json({
        success: false,
        error: 'Title and content are required'
      }, { status: 400 });
    }
    
    // 4. Generate slug from title (matching your model's logic)
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
    
    // 5. Generate excerpt if not provided
    const postExcerpt = excerpt || content.substring(0, 160);
    
    // 6. Calculate reading time (matches your model)
    const words = content.split(/\s+/).length;
    const readingTime = Math.ceil(words / 200);
    
    // 7. Create the blog post
    const post = new BlogPost({
      title,
      slug,
      excerpt: postExcerpt,
      content,
      category: category || 'General',
      tags: tags || [],
      source: source || 'AI Content Writer',
      featured: featured || false,
      status: 'published',
      published: true,
      publishedAt: new Date(),
      readingTime: readingTime,
      metadata: metadata || {},
    });
    
    await post.save();
    
    // 8. Return success response
    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully!',
      post: {
        id: post._id,
        title: post.title,
        slug: post.slug,
        url: `/blog/${post.slug}`,
        createdAt: post.createdAt,
        publishedAt: post.publishedAt,
        readingTime: post.readingTime,
      }
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Webhook error:', error);
    
    // Handle duplicate slug error
    if (error.code === 11000 || error.message?.includes('duplicate')) {
      // If slug exists, add a timestamp to make it unique
      try {
        const body = await request.json();
        const { title, content } = body;
        
        const timestamp = Date.now();
        const newSlug = `${title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/--+/g, '-')
          .trim()}-${timestamp}`;
        
        const post = new BlogPost({
          title,
          slug: newSlug,
          excerpt: content.substring(0, 160),
          content,
          category: body.category || 'General',
          tags: body.tags || [],
          source: 'AI Content Writer',
          status: 'published',
          published: true,
          publishedAt: new Date(),
          readingTime: Math.ceil(content.split(/\s+/).length / 200),
        });
        
        await post.save();
        
        return NextResponse.json({
          success: true,
          message: 'Blog post created with unique slug!',
          post: {
            id: post._id,
            title: post.title,
            slug: post.slug,
            url: `/blog/${post.slug}`,
          }
        }, { status: 201 });
        
      } catch (retryError: any) {
        return NextResponse.json({
          success: false,
          error: 'Failed to create post with unique slug: ' + retryError.message
        }, { status: 500 });
      }
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: errors
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create blog post'
    }, { status: 500 });
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Webhook endpoint is working!',
    instructions: 'Send a POST request with { title, content } to create a blog post',
    example: {
      title: 'My Blog Post',
      content: 'This is the content of my blog post...',
      category: 'Tech',
      tags: ['AI', 'Technology'],
      featured: false,
    }
  });
}