import { useState, useCallback } from 'react';
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
  const [chats, setChats] = useState<Chat[]>([
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
  ]);
  
  const [activeChat, setActiveChat] = useState<string>('1');

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

  return {
    chats,
    activeChat,
    setActiveChat,
    createNewChat,
    addMessage,
    deleteChat,
    getCurrentChat
  };
};