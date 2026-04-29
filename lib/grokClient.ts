// lib/grokClient.ts
import axios from 'axios';

// Groq API Configuration - Using environment variables
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

export const GroqModels = {
  // Llama Models - Best for general chat and content
  LLAMA_3_70B: 'llama3-70b-8192',           // Most powerful, slower
  LLAMA_3_8B: 'llama3-8b-8192',             // Fast, good for simple tasks
  LLAMA_3_3_70B: 'llama-3.3-70b-versatile', // Best balance (RECOMMENDED)
  
  // Mixtral Models - Good for complex reasoning
  MIXTRAL_8x7B: 'mixtral-8x7b-32768',
  
  // Gemma Models - Lightweight and fast
  GEMMA_2_9B: 'gemma2-9b-it',
};

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

export class GrokClient {
  private apiKey: string;
  private baseURL: string;
  private defaultModel: string;

  constructor(
    apiKey?: string,
    baseURL: string = GROQ_API_URL,
    defaultModel: string = GroqModels.LLAMA_3_3_70B
  ) {
    // Use provided apiKey or fallback to environment variable
    if (apiKey) {
      this.apiKey = apiKey;
    } else if (GROQ_API_KEY) {
      this.apiKey = GROQ_API_KEY;
    } else {
      throw new Error('GROQ_API_KEY is not defined in environment variables');
    }
    
    this.baseURL = baseURL;
    this.defaultModel = defaultModel;
    
    console.log('🚀 GrokClient initialized with model:', this.defaultModel);
  }

  async chatCompletion(messages: ChatMessage[], options: ChatOptions = {}) {
    const {
      model = this.defaultModel,
      temperature = 0.7,
      maxTokens = 1000,
      topP = 0.9,
    } = options;

    try {
      console.log(`📡 Calling Groq API with model: ${model}`);
      
      const requestBody: any = {
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        top_p: topP,
      };

      const response = await axios.post(this.baseURL, requestBody, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      });

      console.log('✅ Groq API response received');
      return response.data;
    } catch (error) {
      console.error('❌ Groq API error:', error);
      throw error;
    }
  }

  // Simple chat method for portfolio chatbot
  async chat(messages: ChatMessage[], options?: ChatOptions) {
    return this.chatCompletion(messages, options);
  }
}

// Singleton instance - will throw error if GROQ_API_KEY is not set
let groqClientInstance: GrokClient | null = null;

export function getGroqClient(): GrokClient {
  if (!groqClientInstance) {
    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY environment variable is not set');
    }
    groqClientInstance = new GrokClient();
  }
  return groqClientInstance;
}

// Export a function to check if API key is configured
export function isGroqConfigured(): boolean {
  return !!GROQ_API_KEY;
}

// Export the client (will throw error if not configured)
export const groqClient = (() => {
  if (!GROQ_API_KEY) {
    console.warn('⚠️ GROQ_API_KEY is not set. Please add it to your .env.local file');
    // Return a dummy client that throws helpful error when used
    return {
      chatCompletion: async () => { throw new Error('GROQ_API_KEY not configured. Please add it to .env.local'); },
      chat: async () => { throw new Error('GROQ_API_KEY not configured. Please add it to .env.local'); }
    } as any;
  }
  return new GrokClient();
})();