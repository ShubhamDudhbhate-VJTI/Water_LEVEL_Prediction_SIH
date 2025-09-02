import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  File, 
  Image, 
  FileText, 
  Video, 
  Music, 
  X,
  Check,
  AlertCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: string;
  type: 'image' | 'document' | 'video' | 'audio' | 'other';
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  preview?: string;
}

interface FileUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesUploaded,
  maxFiles = 10,
  maxSize = 50
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const getFileType = useCallback((file: File): UploadedFile['type'] => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type.includes('pdf') || file.type.includes('document') || file.type.includes('text')) {
      return 'document';
    }
    return 'other';
  }, []);

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const simulateUpload = useCallback((fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, progress: 100, status: 'completed' as const }
            : f
        ));
      } else {
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, progress: Math.floor(progress) }
            : f
        ));
      }
    }, 200);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => {
      const id = Math.random().toString(36).substr(2, 9);
      const uploadedFile: UploadedFile = {
        id,
        file,
        name: file.name,
        size: formatFileSize(file.size),
        type: getFileType(file),
        progress: 0,
        status: 'uploading'
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedFiles(prev => prev.map(f => 
            f.id === id ? { ...f, preview: e.target?.result as string } : f
          ));
        };
        reader.readAsDataURL(file);
      }

      // Start upload simulation
      setTimeout(() => simulateUpload(id), 100);
      
      return uploadedFile;
    });

    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, [formatFileSize, getFileType, simulateUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize: maxSize * 1024 * 1024,
    accept: {
      'image/*': [],
      'application/pdf': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
      'text/*': [],
      'video/*': [],
      'audio/*': []
    }
  });

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (type: UploadedFile['type']) => {
    switch (type) {
      case 'image': return Image;
      case 'document': return FileText;
      case 'video': return Video;
      case 'audio': return Music;
      default: return File;
    }
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'completed': return Check;
      case 'error': return AlertCircle;
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-smooth",
          isDragActive 
            ? "border-primary bg-primary/5 shadow-glow" 
            : "border-border hover:border-border-hover hover:bg-surface/50"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          {isDragActive ? (
            <div>
              <p className="text-lg font-medium text-primary">Drop files here!</p>
              <p className="text-sm text-muted-foreground">Release to upload</p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium text-foreground">
                Drag & drop files here, or click to browse
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Support for images, documents, videos, and more (Max {maxSize}MB each)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Uploaded Files</h4>
          {uploadedFiles.map((file) => {
            const FileIcon = getFileIcon(file.type);
            const StatusIcon = getStatusIcon(file.status);
            
            return (
              <div 
                key={file.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-border"
              >
                {/* File Preview/Icon */}
                <div className="relative flex-shrink-0">
                  {file.preview ? (
                    <img 
                      src={file.preview} 
                      alt={file.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                      <FileIcon className="w-5 h-5 text-primary" />
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">
                      {file.name}
                    </p>
                    {StatusIcon && (
                      <StatusIcon className={cn(
                        "w-4 h-4",
                        file.status === 'completed' ? "text-success" : "text-destructive"
                      )} />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{file.size}</p>
                  
                  {/* Progress Bar */}
                  {file.status === 'uploading' && (
                    <Progress value={file.progress} className="mt-2 h-1" />
                  )}
                </div>

                {/* Remove Button */}
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
      )}
    </div>
  );
};