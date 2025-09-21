import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatMessages } from "@/components/ChatMessages";
import { ChatInput } from "@/components/ChatInput";
import { SettingsModal } from "@/components/SettingsModal";
import { AuthModal } from "@/components/AuthModal";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatManager } from "@/hooks/useChatManager";
import { useAuth } from "@/hooks/useAuth";
import { generateAIResponse } from "@/services/openai";

const Index = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const {
    chats,
    activeChat,
    setActiveChat,
    createNewChat,
    addMessage,
    deleteChat,
    deleteMessage,
    getCurrentChat
  } = useChatManager();

  const handleSendMessage = async (content: string, files?: any[]) => {
    if (!activeChat || isGenerating) return;

    // Set loading state
    setIsGenerating(true);

    // Add user message
    addMessage(activeChat, {
      content,
      role: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: files?.map(file => ({
        type: file.type === 'image' ? 'image' : 'document',
        name: file.name,
        url: file.preview || '#',
        size: file.size
      }))
    });

    // Get conversation history for context
    const currentChat = getCurrentChat();
    const conversationHistory = currentChat?.messages.slice(-10).map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    })) || [];

    try {
      // Generate AI response using OpenAI API
      const aiResponse = await generateAIResponse(content, conversationHistory);
      
      addMessage(activeChat, {
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Fallback response
      addMessage(activeChat, {
        content: `Sorry, I encountered an error while processing your request. Please try again or check your API configuration.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`,
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } finally {
      // Clear loading state
      setIsGenerating(false);
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-chat-background text-foreground">
        {/* Sidebar */}
        <ChatSidebar
          onSettingsClick={() => setSettingsOpen(true)}
          onAuthClick={() => setAuthOpen(true)}
          chats={chats}
          activeChat={activeChat}
          onChatSelect={setActiveChat}
          onNewChat={createNewChat}
          onDeleteChat={deleteChat}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-foreground hover:bg-muted p-2 rounded-md transition-colors" />
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gradient-primary flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">AI</span>
                </div>
                <h1 className="font-semibold text-foreground">AI Assistant</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Ready to chat</span>
            </div>
          </header>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <ChatMessages messages={getCurrentChat()?.messages || []} isGenerating={isGenerating} onDeleteMessage={deleteMessage} />
            <ChatInput onSendMessage={handleSendMessage} disabled={!user || isGenerating} isGenerating={isGenerating} />
          </div>
        </main>

        {/* Modals */}
        <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    </SidebarProvider>
  );
};

export default Index;