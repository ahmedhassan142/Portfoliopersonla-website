import { NextRequest, NextResponse } from 'next/server';
import { GrokClient, GrokModels } from '../../../lib/grokClient';
import dotenv from 'dotenv'
import path from 'path';

// Explicitly load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY 
const OPENROUTER_SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://vercel.com/ahmed-hassans-projects-96c42d63';
const OPENROUTER_SITE_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Tech Solutions';
const GROK_MODEL = process.env.NEXT_PUBLIC_GROK_MODEL || GrokModels.GROK_3_MINI;

console.log('🚀 Chat API initialized with model:', GROK_MODEL);

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    
    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Valid messages array is required' },
        { status: 400 }
      );
    }

    // Check API key
    if (!OPENROUTER_API_KEY) {
      console.error('❌ OpenRouter API key not configured');
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    console.log('📨 Received chat request with', messages.length, 'messages');

    // Initialize GrokClient
    const grokClient = new GrokClient(
      OPENROUTER_API_KEY,
      OPENROUTER_SITE_URL,
      OPENROUTER_SITE_NAME
    );

    // Simple system message - no user context
    const systemMessage = {
      role: 'system' as const,
      content: `You are a helpful AI assistant for Tech Solutions. 
You help with questions about:
• Web Development (Next.js, React, TypeScript)
• Mobile Development (React Native, Flutter)
• AI Solutions (ChatGPT, Machine Learning)
• Cloud Services (AWS, Azure, GCP)
• General tech consulting and best practices

Be friendly, professional, and concise in your responses. Keep answers under 150 words unless asked for details.`
    };

    // Combine system message with user messages
    const allMessages = [systemMessage, ...messages];
    
    console.log('🤖 Sending request to OpenRouter with model:', GROK_MODEL);
    
    // Get response from AI
    const response = await grokClient.chatCompletion(allMessages, {
      model: GROK_MODEL,
      stream: false,
      temperature: 0.7,
      maxTokens: 1000,
    });

    console.log('✅ Response received from OpenRouter');
    
    // Return the response
    return NextResponse.json(response);

  } catch (error: any) {
    console.error('❌ Chat API error:', error);
    
    // Return user-friendly error
    return NextResponse.json(
      { 
        error: 'Failed to process your request',
        message: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

// Simple GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    status: 'Chat API is running',
    model: GROK_MODEL,
    message: 'Send POST requests with { messages: [...] } to chat'
  });
}