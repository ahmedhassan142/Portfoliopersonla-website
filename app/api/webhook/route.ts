// ahtech.fun/app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
// ✅ CHANGE THIS LINE to match your actual db connection file
import {connectDB} from '@/lib/db';  // or '@/lib/db' depending on your setup
import BlogPost from '@/models/BlogPost';

export async function POST(request: NextRequest) {
  try {
    console.log('📥 ========== WEBHOOK RECEIVED ==========');
    
    // 1. Get the body
    const body = await request.json();
    console.log('📦 Body:', JSON.stringify(body, null, 2));
    
    const { title, content, category, tags } = body;
    
    // 2. Validate
    if (!title || !content) {
      console.log('❌ Missing title or content');
      return NextResponse.json({
        success: false,
        error: 'Title and content are required'
      }, { status: 400 });
    }
    
    // 3. Connect to database
    console.log('🔌 Connecting to database...');
    await connectDB();
    console.log('✅ Database connected');
    
    // 4. Generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
    console.log(`🔗 Slug: ${slug}`);
    
    // 5. Create blog post
    console.log('💾 Saving to database...');
    const post = await BlogPost.create({
      title,
      slug,
      excerpt: content.substring(0, 160),
      content,
      category: category || 'General',
      tags: tags || [],
      status: 'published',
      published: true,
      publishedAt: new Date(),
      readingTime: Math.ceil(content.split(/\s+/).length / 200),
      source: 'AI Content Writer',
    });
    
    console.log(`✅ Blog post created! ID: ${post._id}`);
    
    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully!',
      post: {
        id: post._id,
        title: post.title,
        slug: post.slug,
        url: `/blog/${post.slug}`,
      }
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('❌ Webhook error:', error);
    console.error('❌ Error stack:', error.stack);
    
    // Handle duplicate slug
    if (error.code === 11000) {
      console.log('🔄 Duplicate slug, retrying...');
      try {
        const body = await request.json();
        const { title, content } = body;
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
          category: body.category || 'General',
          tags: body.tags || [],
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
      } catch (retryError: any) {
        console.error('❌ Retry failed:', retryError);
        return NextResponse.json({
          success: false,
          error: 'Failed to create post with unique slug'
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create blog post'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    success: true,
    status: 'Webhook is active!',
    message: 'Send POST requests with { title, content } to create blog posts'
  });
}