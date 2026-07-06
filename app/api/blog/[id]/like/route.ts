import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import BlogPost from '@/models/BlogPost';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://ah770643:2H3IHP4cvAsXzhW8@cluster0.bdbqw.mongodb.net/Tech-service?retryWrites=true&w=majority&appName=Cluster0";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await mongoose.connect(MONGODB_URI);
    
    const post = await BlogPost.findByIdAndUpdate(
      id,
      { $inc: { 'stats.likes': 1 } },
      { new: true }
    );
    
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      likes: post.stats?.likes || 0
    });
    
  } catch (error: any) {
    console.error('Like error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}