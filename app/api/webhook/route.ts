// ahtech.fun/app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import BlogPost from '../../../models/BlogPost';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://ah770643:2H3IHP4cvAsXzhW8@cluster0.bdbqw.mongodb.net/Tech-service?retryWrites=true&w=majority&appName=Cluster0";

export async function POST(request: NextRequest) {
  try {
    console.log('📥 ========== WEBHOOK RECEIVED ==========');
    
    const body = await request.json();
    console.log('📦 Body:', JSON.stringify(body, null, 2));
    
    const { title, content, category, tags, excerpt, author } = body;
    
    // ✅ ONLY title and content are required
    if (!title || !content) {
      return NextResponse.json({
        success: false,
        error: 'Title and content are required'
      }, { status: 400 });
    }
    
    // Connect to database
    console.log('🔌 Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Database connected');
    
    // ✅ Generate slug from title
    let slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
    
    // ✅ Check if slug already exists
    const existingPost = await BlogPost.findOne({ slug });
    if (existingPost) {
      // ✅ Append timestamp to make it unique
      const timestamp = Date.now();
      slug = `${slug}-${timestamp}`;
      console.log(`🔄 Slug already exists, using: ${slug}`);
    }
    
    // ✅ Create blog post data
    const postData: any = {
      title: title.trim(),
      content: content.trim(),
      slug: slug, // Use the unique slug
    };
    
    // ✅ Add optional fields if provided
    if (excerpt) postData.excerpt = excerpt.trim();
    if (category) postData.category = category.trim();
    if (tags && Array.isArray(tags)) postData.tags = tags;
    if (author) postData.author = author.trim();
    
    // ✅ Create and save the post
    const post = new BlogPost(postData);
    await post.save();
    
    console.log(`✅ Blog post created! ID: ${post._id}, Slug: ${post.slug}`);
    
    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully!',
      post: {
        id: post._id,
        title: post.title,
        slug: post.slug,
        url: `/blog/${post.slug}`,
        excerpt: post.excerpt,
        category: post.category,
        readingTime: post.readingTime,
      }
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('❌ Webhook error:', error);
    
    // ✅ Handle duplicate slug error (fallback)
    if (error.code === 11000) {
      console.log('🔄 Duplicate slug detected, retrying with timestamp...');
      try {
        const body = await request.json();
        const { title, content, category, tags, excerpt, author } = body;
        
        // ✅ Create unique slug with timestamp
        const baseSlug = title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/--+/g, '-')
          .trim();
        const uniqueSlug = `${baseSlug}-${Date.now()}`;
        
        // ✅ Create post with unique slug
        const postData: any = {
          title: title.trim(),
          content: content.trim(),
          slug: uniqueSlug,
        };
        
        if (excerpt) postData.excerpt = excerpt.trim();
        if (category) postData.category = category.trim();
        if (tags && Array.isArray(tags)) postData.tags = tags;
        if (author) postData.author = author.trim();
        
        const post = new BlogPost(postData);
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
    message: 'Send POST requests with { title, content } to create blog posts',
    required: ['title', 'content'],
    optional: ['excerpt', 'category', 'tags', 'author'],
    example: {
      title: 'My Blog Post',
      content: 'This is the full content...',
      excerpt: 'A short summary...',
      category: 'Technology',
      tags: ['AI', 'Webhook'],
      author: 'AI Generator'
    }
  });
}