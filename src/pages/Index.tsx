import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatMessages } from "@/components/ChatMessages";
import { ChatInput } from "@/components/ChatInput";
import { SettingsModal } from "@/components/SettingsModal";
import { AuthModal } from "@/components/AuthModal";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatManager } from "@/hooks/useChatManager";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  
  const {
    chats,
    activeChat,
    setActiveChat,
    createNewChat,
    addMessage,
    deleteChat,
    getCurrentChat
  } = useChatManager();

  const handleSendMessage = (content: string, files?: any[]) => {
    if (!activeChat) return;

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

    // Simulate AI response
    setTimeout(() => {
      addMessage(activeChat, {
        content: "Thank you for your message! I'm processing your request and will provide a helpful response. This is a demo of the AI chat interface with support for file uploads, settings, and user authentication.",
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }, 1000);
  };

  return (
    <div className="h-screen bg-chat-background text-foreground overflow-hidden">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 border-b border-border lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(true)}
          className="text-foreground"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-primary flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">AI</span>
          </div>
          <h1 className="font-semibold text-foreground">AI Assistant</h1>
        </div>
        <div className="w-9" /> {/* Spacer for centering */}
      </div>

      <div className="flex h-full lg:h-screen">
        {/* Sidebar */}
        <ChatSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onSettingsClick={() => setSettingsOpen(true)}
          onAuthClick={() => setAuthOpen(true)}
          chats={chats}
          activeChat={activeChat}
          onChatSelect={(chatId) => {
            setActiveChat(chatId);
            setSidebarOpen(false); // Close sidebar on mobile after selection
          }}
          onNewChat={() => {
            createNewChat();
            setSidebarOpen(false); // Close sidebar on mobile after creating new chat
          }}
          onDeleteChat={deleteChat}
        />

        {/* Main Chat Area */}
        <div className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-spring",
          "lg:ml-0" // Remove margin on large screens since sidebar is positioned
        )}>
          {/* Desktop Header - Hidden on mobile */}
          <div className="hidden lg:flex items-center justify-between p-4 lg:p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-foreground"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">AI Assistant</h1>
                <p className="text-sm text-muted-foreground">Professional Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Ready to chat</span>
            </div>
          </div>

          {/* Messages Area */}
          <ChatMessages messages={getCurrentChat()?.messages || []} />

          {/* Input Area */}
          <ChatInput onSendMessage={handleSendMessage} disabled={!user} />
        </div>
      </div>

      {/* Modals */}
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
};

export default Index;