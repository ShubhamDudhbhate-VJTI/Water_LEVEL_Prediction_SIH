import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar";
import { 
  MessageSquare, 
  Plus, 
  Settings, 
  User, 
  LogOut,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface Chat {
  id: string;
  title: string;
  timestamp: string;
  preview: string;
}

interface ChatSidebarProps {
  onSettingsClick: () => void;
  onAuthClick: () => void;
  chats: Chat[];
  activeChat: string;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  onSettingsClick,
  onAuthClick,
  chats,
  activeChat,
  onChatSelect,
  onNewChat,
  onDeleteChat
}) => {
  const { user, signOut } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={cn("border-r", isCollapsed ? "w-14" : "w-80")} collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-primary-foreground" />
          </div>
          {!isCollapsed && <h1 className="font-semibold text-foreground">AI Chat</h1>}
        </div>
        
        {!isCollapsed && (
          <Button 
            className="w-full mt-4 bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-intense transition-all duration-smooth"
            onClick={onNewChat}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        )}
        
        {isCollapsed && (
          <Button 
            size="sm"
            className="w-full mt-4 bg-gradient-primary text-primary-foreground"
            onClick={onNewChat}
          >
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Recent Chats
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    onClick={() => onChatSelect(chat.id)}
                    isActive={activeChat === chat.id}
                    className="group relative"
                  >
                    <MessageSquare className="w-4 h-4" />
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {chat.title}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {chat.preview}
                        </div>
                      </div>
                    )}
                    {!isCollapsed && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(chat.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onSettingsClick}>
              <Settings className="w-4 h-4" />
              {!isCollapsed && <span>Settings</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {user ? (
            <>
              {!isCollapsed && (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  Signed in as {user.email}
                </div>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={signOut}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  {!isCollapsed && <span>Sign Out</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton onClick={onAuthClick}>
                <User className="w-4 h-4" />
                {!isCollapsed && <span>Sign In / Sign Up</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};