// Free Local AI Service using Ollama
const OLLAMA_BASE_URL = 'http://localhost:11434';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const generateAIResponse = async (
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> => {
  try {
    console.log('🚀 generateAIResponse called with:', userMessage);
    console.log('🤖 Using FREE Local AI (Ollama)');
    console.log('🔗 Connecting to:', OLLAMA_BASE_URL);
    
    // Check if Ollama is running
    try {
      console.log('🔍 Checking Ollama connection...');
      const healthCheck = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
      console.log('✅ Ollama connection status:', healthCheck.status);
      if (!healthCheck.ok) {
        throw new Error('Ollama not running');
      }
    } catch (error) {
      console.log('❌ Ollama connection failed:', error);
      return `🆓 **FREE AI Setup Required**

To use FREE local AI responses:

1. **Download Ollama**: Visit [ollama.ai](https://ollama.ai) and download
2. **Install a model**: Run \`ollama pull llama3:8b\` in terminal
3. **Start Ollama**: Run \`ollama serve\` in terminal
4. **Refresh this page** and try again!

**Benefits:**
✅ 100% FREE - No API keys needed
✅ Runs on your computer
✅ No internet required
✅ Privacy-friendly

**Your message:** ${userMessage}

*This is a free alternative to OpenAI!*`;
    }

    // Prepare messages for Ollama
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful, friendly AI assistant. Provide clear, concise, and helpful responses. Be conversational and engaging.'
      },
      ...conversationHistory,
      {
        role: 'user',
        content: userMessage
      }
    ];

    console.log('📤 Sending request to Ollama with model: llama3:8b');
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3:8b',
        messages: messages,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 200,  // Limit response length for faster responses
        }
      })
    });
    
    console.log('📥 Ollama response status:', response.status);

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('📄 Ollama response data:', data);
    console.log('💬 Extracted content:', data.message?.content);
    return data.message?.content || 'Sorry, I couldn\'t generate a response. Please try again.';
    
  } catch (error) {
    console.error('Ollama API Error:', error);
    
    // Fallback response with helpful error information
    return `🚨 **Local AI Error**

There was an issue connecting to Ollama:

**Error:** ${error instanceof Error ? error.message : 'Unknown error'}

**Quick Setup:**
1. Download from [ollama.ai](https://ollama.ai)
2. Run: \`ollama pull llama3:8b\`
3. Run: \`ollama serve\`
4. Refresh and try again!

**Your message:** ${userMessage}

*This is a FREE local AI solution!*`;
  }
};

export const generateStreamingResponse = async (
  userMessage: string,
  conversationHistory: ChatMessage[] = [],
  onChunk: (chunk: string) => void,
  onComplete: () => void
): Promise<void> => {
  try {
    // Check if Ollama is running
    try {
      const healthCheck = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
      if (!healthCheck.ok) {
        throw new Error('Ollama not running');
      }
    } catch (error) {
      onChunk('🆓 Please install Ollama for free local AI responses. Visit ollama.ai');
      onComplete();
      return;
    }

    const messages = [
      {
        role: 'system',
        content: 'You are a helpful, friendly AI assistant. Provide clear, concise, and helpful responses. Be conversational and engaging.'
      },
      ...conversationHistory,
      {
        role: 'user',
        content: userMessage
      }
    ];

    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3:8b',
        messages: messages,
        stream: true,
        options: {
          temperature: 0.7,
          num_predict: 200,  // Limit response length for faster responses
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim()) {
          try {
            const data = JSON.parse(line);
            if (data.message?.content) {
              onChunk(data.message.content);
            }
          } catch (e) {
            // Skip invalid JSON lines
          }
        }
      }
    }

    onComplete();
  } catch (error) {
    console.error('Ollama Streaming Error:', error);
    onChunk(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    onComplete();
  }
};
