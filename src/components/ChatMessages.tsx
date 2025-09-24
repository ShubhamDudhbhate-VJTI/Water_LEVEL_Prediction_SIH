import React, { useEffect, useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Copy, Download, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatManager, Message } from "@/hooks/useChatManager";

interface ChatMessagesProps {
  messages: Message[];
  isGenerating?: boolean;
  onDeleteMessage?: (messageId: string) => void;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ 
  messages, 
  isGenerating = false, 
  onDeleteMessage 
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { activeChat, sendMessage } = useChatManager();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isGenerating]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleDownload = (url: string, name: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSend = (message: string) => {
    if (activeChat) {
      sendMessage(activeChat, message);
    }
  };

  const MessageActions = ({ message }: { message: Message }) => {
    if (message.role === 'user') return null;
    return (
      <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-smooth">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 px-2 text-muted-foreground hover:text-foreground"
          onClick={() => copyToClipboard(message.content)}
        >
          <Copy className="w-3 h-3" />
        </Button>
        {onDeleteMessage && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-muted-foreground hover:text-destructive"
            onClick={() => onDeleteMessage(message.id)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        )}
      </div>
    );
  };

  const AttachmentPreview = ({ attachment }: { attachment: Message['attachments'][0] }) => (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-surface border border-border mt-2 max-w-xs">
      {attachment.type === 'image' ? (
        <img src={attachment.url} alt={attachment.name} className="w-10 h-10 rounded object-cover" />
      ) : (
        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
          <span className="text-xs font-medium text-primary">
            {attachment.type === 'document' ? 'DOC' : 'FILE'}
          </span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{attachment.name}</p>
        {attachment.size && <p className="text-xs text-muted-foreground">{attachment.size}</p>}
      </div>
      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleDownload(attachment.url, attachment.name)}>
        <Download className="w-3 h-3" />
      </Button>
    </div>
  );

  return (
    <ScrollArea className="flex-1 px-4 lg:px-6">
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Welcome to WaterAI Assistant
            </h3>
            <p className="text-muted-foreground">
              Ask about water levels, flood predictions, or farming water management.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-4 group",
                message.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage 
                  src={message.role === 'user' ? '/user-avatar.png' : '/assistant-avatar.png'} 
                />
                <AvatarFallback className={cn(
                  message.role === 'user' 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-accent text-accent-foreground"
                )}>
                  {message.role === 'user' ? 'U' : 'AI'}
                </AvatarFallback>
              </Avatar>
              <div className={cn(
                "flex-1 max-w-3xl",
                message.role === 'user' ? "flex flex-col items-end" : ""
              )}>
                <div className={cn(
                  "rounded-2xl px-4 py-3 transition-colors duration-smooth",
                  message.role === 'user' 
                    ? "bg-message-user text-primary-foreground ml-12" 
                    : "bg-message-assistant text-foreground mr-12 hover:bg-message-hover"
                )}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {message.attachments.map((attachment, index) => (
                        <AttachmentPreview key={index} attachment={attachment} />
                      ))}
                    </div>
                  )}
                </div>
                <div className={cn(
                  "flex items-center gap-2 mt-1 px-2",
                  message.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}>
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp}
                  </span>
                  <MessageActions message={message} />
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Loading indicator */}
        {isGenerating && (
          <div className="flex gap-4">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback className="bg-accent text-accent-foreground">
                AI
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 max-w-3xl mr-12">
              <div className="rounded-2xl px-4 py-3 bg-message-assistant text-foreground">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm text-muted-foreground">AI is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
};