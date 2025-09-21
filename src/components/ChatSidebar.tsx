// import React from 'react';
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Separator } from "@/components/ui/separator";
// import { 
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarFooter,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
//   SidebarTrigger,
//   useSidebar
// } from "@/components/ui/sidebar";
// import { 
//   MessageSquare, 
//   Plus, 
//   Settings, 
//   User, 
//   LogOut,
//   Trash2,
//   PanelLeftClose,
//   Sparkles
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useAuth } from "@/hooks/useAuth";

// interface Chat {
//   id: string;
//   title: string;
//   timestamp: string;
//   preview: string;
// }

// interface ChatSidebarProps {
//   onSettingsClick: () => void;
//   onAuthClick: () => void;
//   chats: Chat[];
//   activeChat: string;
//   onChatSelect: (chatId: string) => void;
//   onNewChat: () => void;
//   onDeleteChat: (chatId: string) => void;
// }

// export const ChatSidebar: React.FC<ChatSidebarProps> = ({
//   onSettingsClick,
//   onAuthClick,
//   chats,
//   activeChat,
//   onChatSelect,
//   onNewChat,
//   onDeleteChat
// }) => {
//   const { user, signOut } = useAuth();
//   const { state } = useSidebar();
//   const isCollapsed = state === "collapsed";

//   return (
//     <Sidebar 
//       className={cn(
//         "border-r border-border/50 bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-sm",
//         isCollapsed ? "w-16" : "w-80"
//       )} 
//       collapsible="icon"
//     >
//       <SidebarHeader className="p-6 border-b border-border/30">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="relative">
//               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center shadow-lg">
//                 <Sparkles className="w-5 h-5 text-primary-foreground animate-pulse" />
//               </div>
//               <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse"></div>
//             </div>
//             {!isCollapsed && (
//               <div className="flex-1 min-w-0">
//                 <h1 className="font-bold text-lg text-foreground truncate">
//                   WaterAI Assistant
//                 </h1>
//                 <p className="text-xs text-muted-foreground">Water Level Analysis</p>
//               </div>
//             )}
//           </div>
//           {!isCollapsed && (
//             <SidebarTrigger className="h-8 w-8 rounded-lg hover:bg-muted/80 transition-colors">
//               <PanelLeftClose className="h-4 w-4" />
//             </SidebarTrigger>
//           )}
//         </div>
        
//         <Button 
//           className={cn(
//             "mt-6 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0",
//             isCollapsed ? "h-10 w-10 p-0" : "w-full h-12"
//           )}
//           onClick={onNewChat}
//         >
//           <Plus className={cn("h-5 w-5", !isCollapsed && "mr-2")} />
//           {!isCollapsed && <span className="font-medium">Start New Chat</span>}
//         </Button>

//       </SidebarHeader>

//       <SidebarContent className="px-4">
//         <SidebarGroup className="py-4">
//           {!isCollapsed && (
//             <SidebarGroupLabel className="px-2 py-1 text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">
//               Recent Conversations
//             </SidebarGroupLabel>
//           )}
//           <SidebarGroupContent className="mt-2">
//             <ScrollArea className="h-[calc(100vh-300px)]">
//               <SidebarMenu className="space-y-1">
//                 {chats.length === 0 ? (
//                   !isCollapsed && (
//                     <div className="px-3 py-8 text-center">
//                       <MessageSquare className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
//                       <p className="text-sm text-muted-foreground">No conversations yet</p>
//                       <p className="text-xs text-muted-foreground/60 mt-1">Start a new chat to begin</p>
//                     </div>
//                   )
//                 ) : (
//                   chats.map((chat) => (
//                     <SidebarMenuItem key={chat.id}>
//                       <SidebarMenuButton
//                         onClick={() => onChatSelect(chat.id)}
//                         isActive={activeChat === chat.id}
//                         className={cn(
//                           "group relative rounded-lg transition-all duration-200 hover:bg-muted/60",
//                           activeChat === chat.id && "bg-primary/10 border-l-2 border-primary shadow-sm",
//                           isCollapsed ? "h-10 w-10 p-0" : "h-auto p-3"
//                         )}
//                       >
//                         <MessageSquare className={cn(
//                           "flex-shrink-0",
//                           isCollapsed ? "w-5 h-5" : "w-4 h-4",
//                           activeChat === chat.id ? "text-primary" : "text-muted-foreground"
//                         )} />
//                         {!isCollapsed && (
//                           <>
//                             <div className="flex-1 min-w-0 ml-3">
//                               <div className="text-sm font-medium truncate text-foreground">
//                                 {chat.title || "New Chat"}
//                               </div>
//                               <div className="text-xs text-muted-foreground/70 truncate mt-0.5">
//                                 {chat.preview || "No messages yet"}
//                               </div>
//                             </div>
//                             <div
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 onDeleteChat(chat.id);
//                               }}
//                               className="opacity-0 group-hover:opacity-100 transition-all duration-200 h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 ml-2 cursor-pointer flex items-center justify-center rounded hover:bg-destructive/10"
//                             >
//                               <Trash2 className="w-3.5 h-3.5" />
//                             </div>
//                           </>
//                         )}
//                       </SidebarMenuButton>
//                     </SidebarMenuItem>
//                   ))
//                 )}
//               </SidebarMenu>
//             </ScrollArea>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>

//       <SidebarFooter className="p-4 border-t border-border/30 bg-background/50">
//         <SidebarMenu className="space-y-2">
//           {user && !isCollapsed && (
//             <div className="px-3 py-2 mb-2 rounded-lg bg-muted/30">
//               <div className="flex items-center gap-2">
//                 <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
//                   <User className="w-3 h-3 text-primary" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-xs font-medium text-foreground truncate">{user.email}</p>
//                   <p className="text-xs text-muted-foreground">Online</p>
//                 </div>
//               </div>
//             </div>
//           )}
          
//           <SidebarMenuItem>
//             <SidebarMenuButton 
//               onClick={onSettingsClick}
//               className={cn(
//                 "hover:bg-muted/60 transition-colors rounded-lg",
//                 isCollapsed ? "h-10 w-10 p-0" : "h-10 px-3"
//               )}
//             >
//               <Settings className="w-4 h-4 text-muted-foreground" />
//               {!isCollapsed && <span className="ml-3 text-sm">Settings</span>}
//             </SidebarMenuButton>
//           </SidebarMenuItem>
          
//           {user ? (
//             <SidebarMenuItem>
//               <SidebarMenuButton 
//                 onClick={signOut}
//                 className={cn(
//                   "hover:bg-destructive/10 hover:text-destructive transition-all rounded-lg",
//                   isCollapsed ? "h-10 w-10 p-0" : "h-10 px-3"
//                 )}
//               >
//                 <LogOut className="w-4 h-4" />
//                 {!isCollapsed && <span className="ml-3 text-sm">Sign Out</span>}
//               </SidebarMenuButton>
//             </SidebarMenuItem>
//           ) : (
//             <SidebarMenuItem>
//               <SidebarMenuButton 
//                 onClick={onAuthClick}
//                 className={cn(
//                   "hover:bg-primary/10 hover:text-primary transition-all rounded-lg",
//                   isCollapsed ? "h-10 w-10 p-0" : "h-10 px-3"
//                 )}
//               >
//                 <User className="w-4 h-4" />
//                 {!isCollapsed && <span className="ml-3 text-sm">Sign In</span>}
//               </SidebarMenuButton>
//             </SidebarMenuItem>
//           )}
//         </SidebarMenu>
//       </SidebarFooter>
//     </Sidebar>
//   );
// };


import React, { useState } from 'react';
import { Link } from "react-router-dom";
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
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { 
  MessageSquare, 
  Plus, 
  Settings, 
  User, 
  LogOut,
  Trash2,
  PanelLeftClose,
  Sparkles
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
  const [showFooter, setShowFooter] = useState(true);

  return (
    <Sidebar 
      className={cn(
        "border-r border-border/50 bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-sm",
        isCollapsed ? "w-16" : "w-80"
      )} 
      collapsible="icon"
    >
      <SidebarHeader className="p-6 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-primary-foreground animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse"></div>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <h1 className="font-bold text-lg text-foreground truncate">
                  WaterAI Assistant
                </h1>
                <p className="text-xs text-muted-foreground">Water Level Analysis</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <SidebarTrigger className="h-8 w-8 rounded-lg hover:bg-muted/80 transition-colors">
              <PanelLeftClose className="h-4 w-4" />
            </SidebarTrigger>
          )}
        </div>
        
        <Button 
          className={cn(
            "mt-6 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0",
            isCollapsed ? "h-10 w-10 p-0" : "w-full h-12"
          )}
          onClick={onNewChat}
        >
          <Plus className={cn("h-5 w-5", !isCollapsed && "mr-2")} />
          {!isCollapsed && <span className="font-medium">Start New Chat</span>}
        </Button>

        {/* Navigation links for pages */}
        {!isCollapsed && (
          <div className="mt-6 flex flex-col gap-2">
            <Link className="text-sm px-3 py-2 rounded hover:bg-muted/40 transition" to="/analytics">Analytics</Link>
            <Link className="text-sm px-3 py-2 rounded hover:bg-muted/40 transition" to="/documents">Documents</Link>
            <Link className="text-sm px-3 py-2 rounded hover:bg-muted/40 transition" to="/map">Map</Link>
            <Link className="text-sm px-3 py-2 rounded hover:bg-muted/40 transition" to="/api-config">API Config</Link>
            <Link className="text-sm px-3 py-2 rounded hover:bg-muted/40 transition" to="/settings">Settings</Link>
            <Link className="text-sm px-3 py-2 rounded hover:bg-muted/40 transition" to="/upload">Upload Data</Link>
            <Link className="text-sm px-3 py-2 rounded hover:bg-muted/40 transition" to="/welcome">Welcome</Link>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup className="py-4">
          {!isCollapsed && (
            <SidebarGroupLabel className="px-2 py-1 text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">
              Recent Conversations
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent className="mt-2">
            <ScrollArea className="h-[calc(100vh-300px)]">
              <SidebarMenu className="space-y-1">
                {chats.length === 0 ? (
                  !isCollapsed && (
                    <div className="px-3 py-8 text-center">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">No conversations yet</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">Start a new chat to begin</p>
                    </div>
                  )
                ) : (
                  chats.map((chat) => (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton
                        onClick={() => onChatSelect(chat.id)}
                        isActive={activeChat === chat.id}
                        className={cn(
                          "group relative rounded-lg transition-all duration-200 hover:bg-muted/60",
                          activeChat === chat.id && "bg-primary/10 border-l-2 border-primary shadow-sm",
                          isCollapsed ? "h-10 w-10 p-0" : "h-auto p-3"
                        )}
                      >
                        <MessageSquare className={cn(
                          "flex-shrink-0",
                          isCollapsed ? "w-5 h-5" : "w-4 h-4",
                          activeChat === chat.id ? "text-primary" : "text-muted-foreground"
                        )} />
                        {!isCollapsed && (
                          <>
                            <div className="flex-1 min-w-0 ml-3">
                              <div className="text-sm font-medium truncate text-foreground">
                                {chat.title || "New Chat"}
                              </div>
                              <div className="text-xs text-muted-foreground/70 truncate mt-0.5">
                                {chat.preview || "No messages yet"}
                              </div>
                            </div>
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteChat(chat.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-all duration-200 h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 ml-2 cursor-pointer flex items-center justify-center rounded hover:bg-destructive/10"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </div>
                          </>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Toggle button above the footer */}
      {!isCollapsed && (
        <div className="flex justify-center mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFooter((v) => !v)}
            className="text-xs"
          >
            {showFooter ? "Hide Account & Settings" : "Show Account & Settings"}
          </Button>
        </div>
      )}

      {/* Sidebar Footer (hide/show) */}
      {showFooter && (
        <SidebarFooter className="p-4 border-t border-border/30 bg-background/50">
          <SidebarMenu className="space-y-2">
            {user && !isCollapsed && (
              <div className="px-3 py-2 mb-2 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-3 h-3 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                </div>
              </div>
            )}
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={onSettingsClick}
                className={cn(
                  "hover:bg-muted/60 transition-colors rounded-lg",
                  isCollapsed ? "h-10 w-10 p-0" : "h-10 px-3"
                )}
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
                {!isCollapsed && <span className="ml-3 text-sm">Settings</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            {user ? (
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={signOut}
                  className={cn(
                    "hover:bg-destructive/10 hover:text-destructive transition-all rounded-lg",
                    isCollapsed ? "h-10 w-10 p-0" : "h-10 px-3"
                  )}
                >
                  <LogOut className="w-4 h-4" />
                  {!isCollapsed && <span className="ml-3 text-sm">Sign Out</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : (
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={onAuthClick}
                  className={cn(
                    "hover:bg-primary/10 hover:text-primary transition-all rounded-lg",
                    isCollapsed ? "h-10 w-10 p-0" : "h-10 px-3"
                  )}
                >
                  <User className="w-4 h-4" />
                  {!isCollapsed && <span className="ml-3 text-sm">Sign In</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};