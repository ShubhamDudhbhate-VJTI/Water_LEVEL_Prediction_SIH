
// // Free Local AI Service using Ollama
// const OLLAMA_BASE_URL = 'http://localhost:11434';

// export interface ChatMessage {
//   role: 'user' | 'assistant' | 'system';
//   content: string;
// }

// // Non-streaming response (optional)
// export const generateAIResponse = async (
//   userMessage: string,
//   conversationHistory: ChatMessage[] = []
// ): Promise<string> => {
//   try {
//     console.log('🚀 generateAIResponse called with:', userMessage);
    
//     // Check if Ollama is running
//     const healthCheck = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
//     if (!healthCheck.ok) throw new Error('Ollama not running');

//     const messages = [
//       {
//         role: 'system',
//         content: 'You are a helpful, friendly AI assistant. Provide detailed, thorough, and engaging responses. Explain clearly and give examples when needed.'
//       },
//       ...conversationHistory,
//       {
//         role: 'user',
//         content: userMessage
//       }
//     ];

//     const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         model: 'gpt-oss:120b-cloud',
//         messages: messages,
//         stream: false,
//         options: {
//           temperature: 0.7,
//           num_predict: 10000 // practically unlimited output
//         }
//       })
//     });

//     if (!response.ok) throw new Error(`Ollama API error: ${response.status}`);

//     const data = await response.json();
//     return data.message?.content || 'Sorry, I could not generate a response.';
    
//   } catch (error) {
//     console.error('Ollama API Error:', error);
//     return `Error generating response: ${error instanceof Error ? error.message : 'Unknown error'}`;
//   }
// };

// // Streaming response (recommended for long outputs)
// export const generateStreamingResponse = async (
//   userMessage: string,
//   conversationHistory: ChatMessage[] = [],
//   onChunk: (chunk: string) => void,
//   onComplete: () => void
// ): Promise<void> => {
//   try {
//     const healthCheck = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
//     if (!healthCheck.ok) throw new Error('Ollama not running');

//     const messages = [
//       {
//         role: 'system',
//         content: 'You are a helpful, friendly AI assistant. Provide detailed, thorough, and engaging responses. Explain clearly and give examples when needed.'
//       },
//       ...conversationHistory,
//       { role: 'user', content: userMessage }
//     ];

//     const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         model: 'gpt-oss:120b-cloud',
//         messages: messages,
//         stream: true,
//         options: {
//           temperature: 0.7,
//           num_predict: 10000 // practically unlimited output
//         }
//       })
//     });

//     if (!response.ok) throw new Error(`Ollama API error: ${response.status}`);

//     const reader = response.body?.getReader();
//     if (!reader) throw new Error('No response body');

//     const decoder = new TextDecoder();
//     let buffer = '';

//     while (true) {
//       const { done, value } = await reader.read();
//       if (done) break;

//       buffer += decoder.decode(value, { stream: true });
//       const lines = buffer.split('\n');
//       buffer = lines.pop() || '';

//       for (const line of lines) {
//         if (line.trim()) {
//           try {
//             const data = JSON.parse(line);
//             if (data.message?.content) onChunk(data.message.content);
//           } catch (e) { /* ignore invalid JSON */ }
//         }
//       }
//     }

//     onComplete();
//   } catch (error) {
//     console.error('Ollama Streaming Error:', error);
//     onChunk(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     onComplete();
//   }
// };
// const OLLAMA_BASE_URL = 'http://localhost:11434';

// export interface ChatMessage {
//   role: 'user' | 'assistant' | 'system';
//   content: string;
// }

// // RAG API call
// export type RagResult = { answer: string; sources?: Array<{ source?: string; chunk_index?: number; score?: number }>; context?: string; found?: boolean };

// export const getRagAnswer = async (query: string): Promise<RagResult> => {
//   try {
//     const response = await fetch("http://localhost:5000/rag", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ query }),
//     });
//     if (!response.ok) throw new Error(`RAG API error: ${response.status}`);
//     const data = await response.json();
//     return {
//       answer: data.answer || "No RAG answer found.",
//       sources: data.sources || [],
//       context: data.context,
//       found: typeof data.found === 'boolean' ? data.found : (Array.isArray(data.sources) && data.sources.length > 0),
//     };
//   } catch (error) {
//     console.error("RAG API Error:", error);
//     return { answer: `Error from RAG: ${error instanceof Error ? error.message : "Unknown error"}` };
//   }
// };

// // Non-streaming response (RAG first, fallback to Ollama)
// export const generateAIResponse = async (
//   userMessage: string,
//   conversationHistory: ChatMessage[] = []
// ): Promise<string> => {
//   try {
//     console.log('🚀 generateAIResponse called with:', userMessage);

//     // Try RAG first
//     const rag = await getRagAnswer(userMessage);
//     console.log("RAG Answer:", rag);
//     // PRIORITIZE uploaded data: if we found any sources, do NOT fallback to AI
//     if (rag && Array.isArray(rag.sources) && rag.sources.length > 0) {
//       // If LLM failed to produce an answer text, still return a concise line from context
//       if (!rag.answer || rag.answer.startsWith("Error")) {
//         const preview = (rag.context || '').slice(0, 400);
//         return preview ? `From your documents: ${preview}${(rag.context || '').length > 400 ? '...' : ''}` : 'I found relevant passages in your uploaded documents.';
//       }
//       return rag.answer;
//     }

//     // Check if Ollama is running
//     const healthCheck = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
//     if (!healthCheck.ok) throw new Error('Ollama not running');

//     const messages = [
//       {
//         role: 'system',
//         content: 'You are a helpful, friendly AI assistant. Provide detailed, thorough, and engaging responses. Explain clearly and give examples when needed.',
//       },
//       ...conversationHistory,
//       {
//         role: 'user',
//         content: userMessage,
//       },
//     ];

//     const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         model: 'gpt-oss:120b-cloud',
//         messages: messages,
//         stream: false,
//         options: {
//           temperature: 0.7,
//           num_predict: 10000,
//         },
//       }),
//     });

//     if (!response.ok) throw new Error(`Ollama API error: ${response.status}`);

//     const data = await response.json();
//     const content = data.message?.content || 'Sorry, I could not generate a response.';
//     // Show only the final answer in chat UI
//     return content;
//   } catch (error) {
//     console.error('Ollama API Error:', error);
//     return `Error generating response: ${error instanceof Error ? error.message : 'Unknown error'}`;
//   }
// };
















const OLLAMA_BASE_URL = 'http://localhost:11434';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// RAG API call
export type RagResult = { 
  answer: string; 
  sources?: Array<{ source?: string; chunk_index?: number; score?: number }>; 
  context?: string; 
  found?: boolean 
};

export const getRagAnswer = async (query: string): Promise<RagResult> => {
  try {
    const response = await fetch("http://localhost:5000/rag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    if (!response.ok) throw new Error(`RAG API error: ${response.status}`);
    const data = await response.json();
    return {
      answer: data.answer || "",
      sources: data.sources || [],
      context: data.context || "",
      found: typeof data.found === 'boolean' ? data.found : (Array.isArray(data.sources) && data.sources.length > 0),
    };
  } catch (error) {
    console.error("RAG API Error:", error);
    return { answer: `Error from RAG: ${error instanceof Error ? error.message : "Unknown error"}` };
  }
};

// Non-streaming response (RAG first, fallback to Ollama)
export const generateAIResponse = async (
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> => {
  try {
    console.log('🚀 generateAIResponse called with:', userMessage);

    // Try RAG first
    const rag = await getRagAnswer(userMessage);
    console.log("RAG Answer:", rag);

    // Use RAG if it found any meaningful sources
    if (rag && rag.found && rag.sources?.length > 0) {
      if (rag.answer && rag.answer.length > 50) return rag.answer;
      // fallback to first 300 chars of context if answer is empty
      return (rag.context || '').slice(0, 300) || 'I found relevant passages in your documents.';
    }

    // Check if Ollama is running
    const healthCheck = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (!healthCheck.ok) throw new Error('Ollama not running');

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are a helpful, friendly AI assistant. Provide detailed, step-by-step, thorough responses. Explain clearly with examples if needed.',
      },
      ...conversationHistory,
      {
        role: 'user',
        content: rag.context
          ? `Using the following context from documents:\n${rag.context}\n\nQuestion: ${userMessage}`
          : userMessage,
      },
    ];

    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-oss:120b-cloud',
        messages: messages,
        stream: false,
        options: { temperature: 0.7, num_predict: 8000 }, // smaller num_predict = faster
      }),
    });

    if (!response.ok) throw new Error(`Ollama API error: ${response.status}`);

    const data = await response.json();
    const content = data.message?.content || 'Sorry, I could not generate a response.';
    return content;

  } catch (error) {
    console.error('Ollama API Error:', error);
    return `Error generating response: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};
