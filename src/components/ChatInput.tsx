import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "./FileUpload";
import { 
  Send, 
  Paperclip, 
  Mic, 
  MicOff,
  X,
  Image as ImageIcon,
  FileText,
  Video
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string, files?: any[]) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<any[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!message.trim() && attachedFiles.length === 0) || disabled) {
      return;
    }

    onSendMessage(message.trim(), attachedFiles);
    setMessage('');
    setAttachedFiles([]);
    setShowFileUpload(false);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Voice recording logic would go here
  };

  const handleFilesUploaded = (files: any[]) => {
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const removeAttachedFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return ImageIcon;
      case 'document': return FileText;
      case 'video': return Video;
      default: return FileText;
    }
  };

  return (
    <div className="border-t border-border bg-background/95 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        {/* File Upload Modal */}
        {showFileUpload && (
          <div className="mb-4 p-4 border border-border rounded-xl bg-surface">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-foreground">Upload Files</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFileUpload(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <FileUpload onFilesUploaded={handleFilesUploaded} />
          </div>
        )}

        {/* Attached Files */}
        {attachedFiles.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {attachedFiles.map((file) => {
              const FileIcon = getFileIcon(file.type);
              return (
                <div
                  key={file.id}
                  className="flex items-center gap-2 px-3 py-2 bg-surface border border-border rounded-lg"
                >
                  <FileIcon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground truncate max-w-32">
                    {file.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachedFile(file.id)}
                    className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* Main Input Area */}
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          {/* Input Actions */}
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowFileUpload(!showFileUpload)}
              className={cn(
                "h-9 w-9 p-0 transition-colors duration-smooth",
                showFileUpload ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleRecording}
              className={cn(
                "h-9 w-9 p-0 transition-colors duration-smooth",
                isRecording 
                  ? "text-destructive bg-destructive/10 animate-pulse" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isRecording ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Text Input */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder={
                disabled
                  ? "Please sign in to start chatting..."
                  : isRecording 
                  ? "Recording... Click the mic to stop" 
                  : "Type your message or drag & drop files... (Shift+Enter for new line)"
              }
              disabled={disabled || isRecording}
              className={cn(
                "min-h-[44px] max-h-[120px] resize-none bg-input border-border focus:border-primary transition-colors duration-smooth",
                "placeholder:text-muted-foreground"
              )}
            />
          </div>

          {/* Send Button */}
          <Button
            type="submit"
            disabled={(!message.trim() && attachedFiles.length === 0) || disabled || isRecording}
            className={cn(
              "h-11 w-11 p-0 rounded-xl transition-all duration-smooth",
              "bg-gradient-primary text-primary-foreground shadow-glow",
              "hover:shadow-glow-intense disabled:opacity-50 disabled:shadow-none"
            )}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>

        {/* Quick Actions */}
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Press Enter to send, Shift+Enter for new line</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Powered by AI Assistant</span>
          </div>
        </div>
      </div>
    </div>
  );
};