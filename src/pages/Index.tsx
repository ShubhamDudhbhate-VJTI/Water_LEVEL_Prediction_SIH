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
            <ChatMessages messages={getCurrentChat()?.messages || []} />
            <ChatInput onSendMessage={handleSendMessage} disabled={!user} />
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