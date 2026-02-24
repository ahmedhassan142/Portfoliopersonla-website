export const GrokModels = {
  GROK_3_MINI: 'x-ai/grok-3-mini-beta',     // CHEAPEST: $0.30/1M tokens - recommended for most tasks
  GROK_3: 'x-ai/grok-3-beta',               // $3.00/1M tokens - best reasoning
  GROK_2_MINI: 'x-ai/grok-2-mini-beta',     // Legacy, slightly cheaper but slower
  GROK_VISION: 'x-ai/grok-vision-beta',     // For image understanding
  GROK_4: 'x-ai/grok-4'
}

export class GrokClient {
  private apiKey: string
  private siteUrl: string
  private siteName: string

  constructor(apiKey: string, siteUrl: string, siteName: string) {
    this.apiKey = apiKey
    this.siteUrl = siteUrl
    this.siteName = siteName
  }

  async chatCompletion(messages: any[], options: any = {}) {
    try {
      console.log('📡 Calling OpenRouter with model:', options.model);
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': this.siteUrl,
          'X-Title': this.siteName,
        },
        body: JSON.stringify({
          model: options.model || GrokModels.GROK_3_MINI,
          messages: messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 1000,
          top_p: options.topP || 0.9,
          frequency_penalty: options.frequencyPenalty || 0,
          presence_penalty: options.presencePenalty || 0,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ OpenRouter API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        
        // If model is invalid, try fallback model
        if (response.status === 400 && errorData.error?.message?.includes('valid model')) {
          console.log('⚠️ Model invalid, trying fallback model: openai/gpt-3.5-turbo');
          
          // Retry with fallback model
          const fallbackResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': this.siteUrl,
              'X-Title': this.siteName,
            },
            body: JSON.stringify({
              model: 'openai/gpt-3.5-turbo',
              messages: messages,
              temperature: options.temperature || 0.7,
              max_tokens: options.maxTokens || 1000,
            }),
          });
          
          if (!fallbackResponse.ok) {
            const fallbackError = await fallbackResponse.json();
            throw new Error(`Fallback failed: ${JSON.stringify(fallbackError)}`);
          }
          
          console.log('✅ Fallback successful with GPT-3.5');
          return fallbackResponse.json();
        }
        
        throw new Error(`OpenRouter API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log('✅ OpenRouter response received');
      return data;

    } catch (error) {
      console.error('❌ GrokClient error:', error);
      throw error;
    }
  }
}