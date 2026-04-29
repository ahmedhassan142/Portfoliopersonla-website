// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getGroqClient, GroqModels, isGroqConfigured } from '@/lib/grokClient';

// Portfolio website context - tells the AI about your services
const PORTFOLIO_CONTEXT = `You are Ahmed's AI Assistant. Ahmed is a professional software developer offering premium services:

## Services Offered:
### 1. Web Development
- Next.js, React, Vue.js, Angular
- Full-stack development
- E-commerce websites
- Custom web applications
- WordPress and headless CMS

### 2. Mobile App Development
- React Native (iOS & Android)
- Flutter development
- Cross-platform apps
- Mobile UI/UX design
- App store deployment

### 3. AI Development
- AI content writing apps
- Chatbot integration (GPT, Claude, Llama, Groq)
- LLM fine-tuning and deployment
- AI automation solutions
- RAG (Retrieval-Augmented Generation) systems

## Pricing Guidelines:
- Simple Website: $500 - $1,500
- Complex Web App: $2,000 - $5,000
- Mobile App (single platform): $1,500 - $4,000
- Mobile App (both platforms): $3,000 - $8,000
- AI Integration: $1,000 - $5,000 (depends on complexity)
- Custom AI Solution: Starting at $3,000

## Contact Information:
- Email: ahmed@example.com
- WhatsApp: +92 XXX XXXXXXX
- Response time: Within 24 hours (usually 2-4 hours)

## Your Role:
- Be friendly, professional, and helpful
- Ask clarifying questions about project requirements
- Provide estimated timelines when asked (2-8 weeks typical)
- Share portfolio examples when relevant
- If asked about pricing, provide the ranges above
- If you don't know something, say so honestly
- Keep responses concise but informative (under 200 words)
- Encourage users to share their project details
- Ask for availability for a free consultation call

## Prohibited:
- Don't give false promises
- Don't share sensitive information
- Don't write code in responses (just discuss solutions)
- Don't negotiate prices (refer to contact form)
- Don't make guarantees about SEO rankings`;

export async function POST(request: NextRequest) {
  try {
    // Check if Groq API is configured
    if (!isGroqConfigured()) {
      console.error('❌ Groq API key not configured');
      return NextResponse.json(
        { 
          error: 'Chat service is not configured',
          message: 'Please contact support to enable chat functionality.'
        },
        { status: 503 }
      );
    }

    const { messages, model, temperature } = await request.json();
    
    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Valid messages array is required' },
        { status: 400 }
      );
    }

    console.log(`📨 Received ${messages.length} messages from user`);

    // Prepare messages with portfolio context
    const systemMessage = {
      role: 'system' as const,
      content: PORTFOLIO_CONTEXT
    };

    const allMessages = [systemMessage, ...messages];

    // Get Groq client
    const groqClient = getGroqClient();

    // Get response from Groq
    const response = await groqClient.chatCompletion(allMessages, {
      model: model || GroqModels.LLAMA_3_3_70B,
      temperature: temperature || 0.7,
      maxTokens: 500,
    });

    const reply = response.choices[0].message.content;
    console.log('✅ AI Response generated');

    return NextResponse.json({
      success: true,
      message: reply,
      usage: response.usage,
      model: model || GroqModels.LLAMA_3_3_70B
    });

  } catch (error: any) {
    console.error('❌ Chat API error:', error);
    
    // Check for specific API key error
    if (error.message?.includes('GROQ_API_KEY not configured')) {
      return NextResponse.json(
        { 
          error: 'Chat service is not configured',
          message: 'The chat service is temporarily unavailable.'
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to process your request',
        message: error.message || 'Unknown error occurred. Please try again.'
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  const isConfigured = isGroqConfigured();
  
  return NextResponse.json({
    status: 'Chat API is running',
    configured: isConfigured,
    model: isConfigured ? 'Groq Llama 3.3 70B' : null,
    services: ['Web Development', 'Mobile App Development', 'AI Development'],
    message: isConfigured ? 'Ready to chat!' : 'API key not configured. Please add GROQ_API_KEY to .env.local'
  });
}