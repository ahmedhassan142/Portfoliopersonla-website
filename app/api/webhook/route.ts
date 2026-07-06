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
    
    // ✅ Get all fields including featuredImage
    const { 
      title, 
      content, 
      category, 
      tags, 
      excerpt, 
      author, 
      featuredImage,  // ✅ This is the new field
      source,
      featured 
    } = body;
    
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
      const timestamp = Date.now();
      slug = `${slug}-${timestamp}`;
      console.log(`🔄 Slug already exists, using: ${slug}`);
    }
    
    // ✅ Create blog post data with featuredImage
    const postData: any = {
      title: title.trim(),
      content: content.trim(),
      slug: slug,
      // ✅ Add featuredImage if provided
      featuredImage: featuredImage || '',
    };
    
    // ✅ Add optional fields if provided
    if (excerpt) postData.excerpt = excerpt.trim();
    if (category) postData.category = category.trim();
    if (tags && Array.isArray(tags)) postData.tags = tags;
    if (author) postData.author = author.trim();
    if (source) postData.source = source;
    if (featured !== undefined) postData.featured = featured;
    
    // ✅ Create and save the post
    const post = new BlogPost(postData);
    await post.save();
    
    console.log(`✅ Blog post created! ID: ${post._id}, Slug: ${post.slug}`);
    console.log(`🖼️ Featured Image: ${post.featuredImage || 'None'}`);
    
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
        featuredImage: post.featuredImage, // ✅ Return the image in response
      }
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('❌ Webhook error:', error);
    
    // Handle duplicate slug
    if (error.code === 11000) {
      console.log('🔄 Duplicate slug, retrying with timestamp...');
      try {
        const body = await request.json();
        const { title, content, featuredImage } = body;
        
        const newSlug = `${title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/--+/g, '-')
          .trim()}-${Date.now()}`;
        
        const post = new BlogPost({
          title: title.trim(),
          content: content.trim(),
          slug: newSlug,
          category: body.category || 'Uncategorized',
          tags: body.tags || [],
          featuredImage: featuredImage || '',
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
            featuredImage: post.featuredImage,
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
    optional: ['excerpt', 'category', 'tags', 'author', 'featuredImage'],
    example: {
      title: 'My Blog Post',
      content: 'This is the full content...',
      excerpt: 'A short summary...',
      category: 'Technology',
      tags: ['AI', 'Webhook'],
      author: 'AI Generator',
      featuredImage: 'https://example.com/image.jpg'
    }
  });
}