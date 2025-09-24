import { useState, useCallback, useEffect } from 'react';
import { nanoid } from 'nanoid';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  attachments?: Array<{
    type: 'image' | 'document' | 'file';
    name: string;
    url: string;
    size?: string;
  }>;
}

export interface Chat {
  id: string;
  title: string;
  timestamp: string;
  preview: string;
  messages: Message[];
}

export const useChatManager = () => {
  const [chats, setChats] = useState<Chat[]>(() => {
    // Load chats from localStorage on initialization
    const savedChats = localStorage.getItem('chatboat-chats');
    if (savedChats) {
      try {
        return JSON.parse(savedChats);
      } catch (error) {
        console.error('Error parsing saved chats:', error);
      }
    }
    
    // Default welcome chat if no saved chats
    return [
      {
        id: '1',
        title: 'Welcome Chat',
        timestamp: 'Just now',
        preview: 'Hello! I\'m your AI assistant...',
        messages: [
          {
            id: 'welcome-1',
            content: "Hello! I'm your AI assistant. I'm here to help answer questions, provide information, and have meaningful conversations. What would you like to talk about today?",
            role: 'assistant',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]
      }
    ];
  });
  
  const [activeChat, setActiveChat] = useState<string>('1');

  // Save chats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatboat-chats', JSON.stringify(chats));
  }, [chats]);

  const createNewChat = useCallback(() => {
    const newChatId = nanoid();
    const newChat: Chat = {
      id: newChatId,
      title: 'New Conversation',
      timestamp: 'Just now',
      preview: 'New conversation started...',
      messages: [
        {
          id: nanoid(),
          content: "Hello! I'm ready to help you with anything you need. What can I assist you with today?",
          role: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    setChats(prev => [newChat, ...prev]);
    setActiveChat(newChatId);
    return newChatId;
  }, []);

  const addMessage = useCallback((chatId: string, message: Omit<Message, 'id'>) => {
    const newMessage = { ...message, id: nanoid() };
    
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        const updatedMessages = [...chat.messages, newMessage];
        const preview = message.role === 'user' 
          ? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
          : chat.preview;
        
        return {
          ...chat,
          messages: updatedMessages,
          timestamp: 'Just now',
          preview,
          title: chat.messages.length === 1 && message.role === 'user' 
            ? message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
            : chat.title
        };
      }
      return chat;
    }));
  }, []);

  const deleteChat = useCallback((chatId: string) => {
    setChats(prev => {
      const filtered = prev.filter(chat => chat.id !== chatId);
      if (activeChat === chatId && filtered.length > 0) {
        setActiveChat(filtered[0].id);
      }
      return filtered;
    });
  }, [activeChat]);

  const getCurrentChat = useCallback(() => {
    return chats.find(chat => chat.id === activeChat);
  }, [chats, activeChat]);

  const deleteMessage = useCallback((messageId: string) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === activeChat) {
        const updatedMessages = chat.messages.filter(msg => msg.id !== messageId);
        return {
          ...chat,
          messages: updatedMessages,
          preview: updatedMessages.length > 0 
            ? updatedMessages[updatedMessages.length - 1].content.slice(0, 50) + (updatedMessages[updatedMessages.length - 1].content.length > 50 ? '...' : '')
            : 'Empty conversation'
        };
      }
      return chat;
    }));
  }, [activeChat]);

  const fetchAnswerFromBackend = useCallback(async (query: string) => {
    try {
      const response = await fetch("http://localhost:5000/rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data.answer || "I'm sorry, I couldn't find an answer.";
    } catch (error) {
      console.error("Failed to fetch answer from backend:", error);
      return "An error occurred while fetching the answer.";
    }
  }, []);

  const sendMessage = useCallback(
    async (chatId: string, content: string) => {
      const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const userMessage: Message = {
        id: nanoid(),
        content,
        role: "user",
        timestamp,
      };

      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: [...chat.messages, userMessage],
              preview: content,
              timestamp: "Just now",
            };
          }
          return chat;
        });
        return updatedChats;
      });

      const assistantResponse = await fetchAnswerFromBackend(content);

      const assistantMessage: Message = {
        id: nanoid(),
        content: assistantResponse,
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: [...chat.messages, assistantMessage],
              preview: assistantResponse,
              timestamp: "Just now",
            };
          }
          return chat;
        });
        return updatedChats;
      });
    },
    [fetchAnswerFromBackend]
  );

  return {
    chats,
    activeChat,
    setActiveChat,
    createNewChat,
    addMessage,
    deleteChat,
    deleteMessage,
    getCurrentChat,
    sendMessage
  };
};