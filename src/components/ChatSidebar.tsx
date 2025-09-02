import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  Plus, 
  Settings, 
  User, 
  Menu, 
  X,
  LogOut,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatHistory {
  id: string;
  title: string;
  timestamp: string;
  preview: string;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onSettingsClick: () => void;
  onAuthClick: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  onToggle,
  onSettingsClick,
  onAuthClick
}) => {
  const [activeChat, setActiveChat] = useState<string>('1');
  
  const mockChatHistory: ChatHistory[] = [
    {
      id: '1',
      title: 'AI Assistant Chat',
      timestamp: 'Just now',
      preview: 'Hello! I\'m your AI assistant...'
    },
    {
      id: '2',
      title: 'Photo Enhancement',
      timestamp: '2 hours ago',
      preview: 'Can you help me enhance this image?'
    },
    {
      id: '3',
      title: 'Document Analysis',
      timestamp: 'Yesterday',
      preview: 'Please analyze this PDF document...'
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-50 h-full bg-sidebar-bg border-r border-border flex flex-col transition-transform duration-300 ease-spring",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        "w-80 lg:relative lg:z-auto"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="font-semibold text-foreground">AI Chat</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="lg:hidden"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button 
            className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-intense transition-all duration-smooth"
            onClick={() => setActiveChat('')}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Chat History */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Recent Chats
            </h3>
            {mockChatHistory.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={cn(
                  "group p-3 rounded-lg cursor-pointer transition-all duration-smooth border",
                  activeChat === chat.id 
                    ? "bg-surface border-primary shadow-custom-sm" 
                    : "hover:bg-surface-hover border-transparent"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {chat.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {chat.preview}
                    </p>
                    <span className="text-xs text-muted-foreground mt-2 block">
                      {chat.timestamp}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Separator />

        {/* Bottom Actions */}
        <div className="p-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={onSettingsClick}
          >
            <Settings className="w-4 h-4 mr-3" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={onAuthClick}
          >
            <User className="w-4 h-4 mr-3" />
            Sign In / Sign Up
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>
    </>
  );
};