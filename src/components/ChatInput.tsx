import React, { useState, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "./FileUpload";
import { useToast } from "@/hooks/use-toast";
import { nanoid } from "nanoid";
import { 
  Send, 
  Paperclip, 
  Mic, 
  MicOff,
  X,
  Image as ImageIcon,
  FileText,
  Video,
  Music,
  File as FileIcon,
  Check,
  AlertCircle
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
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!message.trim() && attachedFiles.length === 0) || disabled) {
      return;
    }

    // Only send files that are fully uploaded
    const readyFiles = attachedFiles.filter(f => (uploadProgress[f.id] || 0) >= 100);
    
    if (attachedFiles.length > 0 && readyFiles.length === 0) {
      toast({
        title: "Files not ready",
        description: "Please wait for files to finish uploading.",
        variant: "destructive"
      });
      return;
    }

    onSendMessage(message.trim(), readyFiles);
    setMessage('');
    setAttachedFiles([]);
    setUploadProgress({});
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
    if (!isRecording) {
      toast({
        title: "Voice recording",
        description: "Voice recording feature coming soon!",
      });
    }
  };

  const handleFilesUploaded = (files: any[]) => {
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return ImageIcon;
      case 'document': return FileText;
      case 'video': return Video;
      case 'audio': return Music;
      default: return FileIcon;
    }
  };

  // File validation
  const validateFile = useCallback((file: File) => {
    const maxSize = 20 * 1024 * 1024; // 20MB
    const allowedTypes = [
      'image/', 'video/', 'audio/', 'text/', 'application/pdf',
      'application/msword', 'application/vnd.openxmlformats-officedocument'
    ];
    
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `${file.name} is larger than 20MB. Please choose a smaller file.`,
        variant: "destructive"
      });
      return false;
    }
    
    const isValidType = allowedTypes.some(type => file.type.startsWith(type));
    if (!isValidType) {
      toast({
        title: "Unsupported file type",
        description: `${file.name} is not a supported file type.`,
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  }, [toast]);

  // Format file size
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Simulate file upload with progress
  const simulateUpload = useCallback((fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
        toast({
          title: "File ready",
          description: "File successfully processed and ready to send.",
        });
      } else {
        setUploadProgress(prev => ({ ...prev, [fileId]: Math.floor(progress) }));
      }
    }, 150);
  }, [toast]);

  // Handle paste operations for images and files
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    
    items.forEach((item) => {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file && validateFile(file)) {
          const fileObj = {
            id: nanoid(),
            name: `pasted-image-${Date.now()}.${file.type.split('/')[1]}`,
            type: 'image',
            size: formatFileSize(file.size),
            file: file,
            preview: URL.createObjectURL(file),
            status: 'uploading'
          };
          setAttachedFiles(prev => [...prev, fileObj]);
          simulateUpload(fileObj.id);
          
          toast({
            title: "Image pasted",
            description: "Processing pasted image...",
          });
        }
      }
    });
  }, [validateFile, simulateUpload, formatFileSize, toast]);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    
    files.forEach((file) => {
      if (validateFile(file)) {
        const fileObj = {
          id: nanoid(),
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' : 
                file.type.startsWith('audio/') ? 'audio' : 'document',
          size: formatFileSize(file.size),
          file: file,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
          status: 'uploading'
        };
        setAttachedFiles(prev => [...prev, fileObj]);
        simulateUpload(fileObj.id);
      }
    });
    
    if (files.length > 0) {
      toast({
        title: `${files.length} file(s) dropped`,
        description: "Processing dropped files...",
      });
    }
  }, [validateFile, simulateUpload, formatFileSize, toast]);

  // Remove attached file
  const removeFile = useCallback((fileId: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  }, []);

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

        {/* Attached Files Preview */}
        {attachedFiles.length > 0 && (
          <div className="mb-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Attached Files ({attachedFiles.length})
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setAttachedFiles([]);
                  setUploadProgress({});
                }}
                className="h-6 text-xs text-muted-foreground hover:text-destructive"
              >
                Clear all
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {attachedFiles.map((file) => {
                const Icon = getFileIcon(file.type);
                const progress = uploadProgress[file.id] || 0;
                const isCompleted = progress >= 100;
                
                return (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border hover:bg-surface-hover transition-colors"
                  >
                    {/* File preview or icon */}
                    <div className="relative flex-shrink-0">
                      {file.preview ? (
                        <div className="relative">
                          <img 
                            src={file.preview} 
                            alt={file.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                          {!isCompleted && (
                            <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                      )}
                      
                      {/* Status indicator */}
                      {isCompleted && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-success rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* File info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{file.size}</span>
                        {!isCompleted && (
                          <span className="text-xs text-primary">{progress}%</span>
                        )}
                      </div>
                      
                      {/* Progress bar */}
                      {!isCompleted && (
                        <div className="mt-2 w-full bg-border rounded-full h-1">
                          <div 
                            className="bg-primary h-1 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Remove button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
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

          {/* Text Input with Drag & Drop Support */}
          <div 
            className={cn(
              "flex-1 relative transition-all duration-200",
              isDragging && "ring-2 ring-primary ring-offset-2 ring-offset-background"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              onPaste={handlePaste}
              placeholder={
                disabled
                  ? "Please sign in to start chatting..."
                  : isRecording 
                  ? "🎤 Recording... Click the mic to stop" 
                  : isDragging
                  ? "📁 Drop files here to attach..."
                  : "💬 Message AI Assistant... (Paste images 📷, drag files 📎, or Shift+Enter for new line)"
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
            <span>💡 Pro tip: Paste images directly, drag files, or click 📎 to attach</span>
          </div>
          <div className="flex items-center gap-2">
            {attachedFiles.length > 0 && (
              <span className="text-primary">
                {attachedFiles.filter(f => (uploadProgress[f.id] || 0) >= 100).length}/{attachedFiles.length} ready
              </span>
            )}
            <span>Powered by AI Assistant</span>
          </div>
        </div>
      </div>
    </div>
  );
};