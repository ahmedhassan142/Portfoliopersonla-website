// ahtech.fun/app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://ah770643:2H3IHP4cvAsXzhW8@cluster0.bdbqw.mongodb.net/Tech-service?retryWrites=true&w=majority&appName=Cluster0";

// Define BlogPost schema directly here for testing
const BlogPostSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  excerpt: String,
  content: String,
  category: String,
  tags: [String],
  status: String,
  published: Boolean,
  publishedAt: Date,
  readingTime: Number,
  source: String,
});

const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

export async function POST(request: NextRequest) {
  try {
    console.log('📥 ========== WEBHOOK RECEIVED ==========');
    
    const body = await request.json();
    const { title, content, category, tags } = body;
    
    if (!title || !content) {
      return NextResponse.json({
        success: false,
        error: 'Title and content are required'
      }, { status: 400 });
    }
    
    // Connect directly
    console.log('🔌 Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Database connected');
    
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
    
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