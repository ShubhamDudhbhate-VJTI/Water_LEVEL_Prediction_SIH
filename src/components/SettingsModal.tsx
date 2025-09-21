import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  MessageSquare, 
  Database,
  Download,
  Trash2,
  Save
} from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    // Profile
    displayName: localStorage.getItem('chatboat-username') || 'User',
    email: 'user@example.com',
    avatar: '',
    
    // Appearance
    language: localStorage.getItem('chatboat-language') || 'en',
    fontSize: [parseInt(localStorage.getItem('chatboat-fontSize') || '14')],
    compactMode: localStorage.getItem('chatboat-compactMode') === 'true',
    animationsEnabled: localStorage.getItem('chatboat-animations') !== 'false',
    sidebarCollapsed: localStorage.getItem('chatboat-sidebarCollapsed') === 'true',
    messageBubbles: localStorage.getItem('chatboat-messageBubbles') !== 'false',
    
    // Chat Behavior
    autoSave: localStorage.getItem('chatboat-autoSave') !== 'false',
    autoScroll: localStorage.getItem('chatboat-autoScroll') !== 'false',
    soundEnabled: localStorage.getItem('chatboat-soundEnabled') !== 'false',
    typingIndicators: localStorage.getItem('chatboat-typingIndicators') !== 'false',
    messagePreview: localStorage.getItem('chatboat-messagePreview') !== 'false',
    readReceipts: localStorage.getItem('chatboat-readReceipts') !== 'false',
    smartReplies: localStorage.getItem('chatboat-smartReplies') !== 'false',
    autoComplete: localStorage.getItem('chatboat-autoComplete') !== 'false',
    
    // Privacy & Data
    analyticsEnabled: localStorage.getItem('chatboat-analytics') !== 'false',
    crashReportsEnabled: localStorage.getItem('chatboat-crashReports') !== 'false',
    personalizedAds: localStorage.getItem('chatboat-personalizedAds') === 'true',
    dataRetention: localStorage.getItem('chatboat-dataRetention') || '30',
    clearHistoryOnExit: localStorage.getItem('chatboat-clearHistoryOnExit') === 'true',
    
    // Notifications
    pushNotifications: localStorage.getItem('chatboat-pushNotifications') !== 'false',
    emailNotifications: localStorage.getItem('chatboat-emailNotifications') === 'true',
    desktopNotifications: localStorage.getItem('chatboat-desktopNotifications') !== 'false',
    soundNotifications: localStorage.getItem('chatboat-soundNotifications') !== 'false',
    vibrationEnabled: localStorage.getItem('chatboat-vibration') === 'true',
    
    // Advanced
    apiEndpoint: localStorage.getItem('chatboat-apiEndpoint') || 'http://localhost:11434',
    modelName: localStorage.getItem('chatboat-modelName') || 'llama3:8b',
    maxTokens: parseInt(localStorage.getItem('chatboat-maxTokens') || '200'),
    temperature: parseFloat(localStorage.getItem('chatboat-temperature') || '0.7'),
    debugMode: localStorage.getItem('chatboat-debugMode') === 'true',
    experimentalFeatures: localStorage.getItem('chatboat-experimentalFeatures') === 'true',
  });

  // Apply saved settings on mount
  useEffect(() => {
    const savedFontSize = localStorage.getItem('chatboat-fontSize');
    const savedTheme = localStorage.getItem('chatboat-theme');
    
    if (savedFontSize) {
      document.documentElement.style.setProperty('--base-font-size', `${savedFontSize}px`);
    }
    
    if (savedTheme && savedTheme !== theme) {
      setTheme(savedTheme);
    }
  }, [theme, setTheme]);

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const handleSave = () => {
    // Save all settings to localStorage
    localStorage.setItem('chatboat-username', settings.displayName);
    localStorage.setItem('chatboat-fontSize', settings.fontSize[0].toString());
    localStorage.setItem('chatboat-theme', theme || 'system');
    localStorage.setItem('chatboat-language', settings.language);
    localStorage.setItem('chatboat-compactMode', settings.compactMode.toString());
    localStorage.setItem('chatboat-animations', settings.animationsEnabled.toString());
    localStorage.setItem('chatboat-sidebarCollapsed', settings.sidebarCollapsed.toString());
    localStorage.setItem('chatboat-messageBubbles', settings.messageBubbles.toString());
    localStorage.setItem('chatboat-autoSave', settings.autoSave.toString());
    localStorage.setItem('chatboat-autoScroll', settings.autoScroll.toString());
    localStorage.setItem('chatboat-soundEnabled', settings.soundEnabled.toString());
    localStorage.setItem('chatboat-typingIndicators', settings.typingIndicators.toString());
    localStorage.setItem('chatboat-messagePreview', settings.messagePreview.toString());
    localStorage.setItem('chatboat-readReceipts', settings.readReceipts.toString());
    localStorage.setItem('chatboat-smartReplies', settings.smartReplies.toString());
    localStorage.setItem('chatboat-autoComplete', settings.autoComplete.toString());
    localStorage.setItem('chatboat-analytics', settings.analyticsEnabled.toString());
    localStorage.setItem('chatboat-crashReports', settings.crashReportsEnabled.toString());
    localStorage.setItem('chatboat-personalizedAds', settings.personalizedAds.toString());
    localStorage.setItem('chatboat-dataRetention', settings.dataRetention);
    localStorage.setItem('chatboat-clearHistoryOnExit', settings.clearHistoryOnExit.toString());
    localStorage.setItem('chatboat-pushNotifications', settings.pushNotifications.toString());
    localStorage.setItem('chatboat-emailNotifications', settings.emailNotifications.toString());
    localStorage.setItem('chatboat-desktopNotifications', settings.desktopNotifications.toString());
    localStorage.setItem('chatboat-soundNotifications', settings.soundNotifications.toString());
    localStorage.setItem('chatboat-vibration', settings.vibrationEnabled.toString());
    localStorage.setItem('chatboat-apiEndpoint', settings.apiEndpoint);
    localStorage.setItem('chatboat-modelName', settings.modelName);
    localStorage.setItem('chatboat-maxTokens', settings.maxTokens.toString());
    localStorage.setItem('chatboat-temperature', settings.temperature.toString());
    localStorage.setItem('chatboat-debugMode', settings.debugMode.toString());
    localStorage.setItem('chatboat-experimentalFeatures', settings.experimentalFeatures.toString());
    
    // Apply visual settings
    document.documentElement.style.setProperty('--base-font-size', `${settings.fontSize[0]}px`);
    
    // Apply compact mode
    if (settings.compactMode) {
      document.body.classList.add('compact-mode');
    } else {
      document.body.classList.remove('compact-mode');
    }
    
    // Apply animations
    if (!settings.animationsEnabled) {
      document.body.classList.add('no-animations');
    } else {
      document.body.classList.remove('no-animations');
    }
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('settingsUpdated', { 
      detail: settings 
    }));
    
    console.log('Settings saved:', settings);
    onClose();
  };

  const handleExportData = () => {
    // Export user data logic
    console.log('Exporting user data...');
  };

  const handleDeleteAccount = () => {
    // Delete account logic with confirmation
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Deleting account...');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
            Settings
          </DialogTitle>
          <DialogDescription>
            Customize your AI Assistant experience
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Advanced
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Data
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 max-h-[50vh] overflow-y-auto">
            <TabsContent value="profile" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={settings.displayName}
                    onChange={(e) => updateSetting('displayName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateSetting('email', e.target.value)}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground">Account Actions</h4>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="ar">Arabic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select value={theme} onValueChange={handleThemeChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
                
                  <div className="space-y-2">
                    <Label>Font Size: {settings.fontSize[0]}px</Label>
                    <Slider
                      value={settings.fontSize}
                      onValueChange={(value) => updateSetting('fontSize', value)}
                      max={24}
                      min={10}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="compactMode">Compact Mode</Label>
                      <p className="text-xs text-muted-foreground">Reduce spacing for more content</p>
                    </div>
                    <Switch
                      id="compactMode"
                      checked={settings.compactMode}
                      onCheckedChange={(checked) => updateSetting('compactMode', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="animationsEnabled">Animations</Label>
                      <p className="text-xs text-muted-foreground">Enable smooth transitions</p>
                    </div>
                    <Switch
                      id="animationsEnabled"
                      checked={settings.animationsEnabled}
                      onCheckedChange={(checked) => updateSetting('animationsEnabled', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="messageBubbles">Message Bubbles</Label>
                      <p className="text-xs text-muted-foreground">Show chat bubbles</p>
                    </div>
                    <Switch
                      id="messageBubbles"
                      checked={settings.messageBubbles}
                      onCheckedChange={(checked) => updateSetting('messageBubbles', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sidebarCollapsed">Start with Sidebar Collapsed</Label>
                      <p className="text-xs text-muted-foreground">Collapse sidebar by default</p>
                    </div>
                    <Switch
                      id="sidebarCollapsed"
                      checked={settings.sidebarCollapsed}
                      onCheckedChange={(checked) => updateSetting('sidebarCollapsed', checked)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="chat" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                    <Label htmlFor="autoSave">Auto-save conversations</Label>
                      <p className="text-xs text-muted-foreground">Automatically save chat history</p>
                    </div>
                    <Switch
                      id="autoSave"
                      checked={settings.autoSave}
                      onCheckedChange={(checked) => updateSetting('autoSave', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoScroll">Auto-scroll to new messages</Label>
                      <p className="text-xs text-muted-foreground">Scroll to latest messages</p>
                    </div>
                    <Switch
                      id="autoScroll"
                      checked={settings.autoScroll}
                      onCheckedChange={(checked) => updateSetting('autoScroll', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                    <Label htmlFor="soundEnabled">Sound effects</Label>
                      <p className="text-xs text-muted-foreground">Play sounds for actions</p>
                    </div>
                    <Switch
                      id="soundEnabled"
                      checked={settings.soundEnabled}
                      onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
                    />
                  </div>

                <div className="flex items-center justify-between">
                  <div>
                      <Label htmlFor="typingIndicators">Typing indicators</Label>
                      <p className="text-xs text-muted-foreground">Show when AI is generating</p>
                    </div>
                    <Switch
                      id="typingIndicators"
                      checked={settings.typingIndicators}
                      onCheckedChange={(checked) => updateSetting('typingIndicators', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="messagePreview">Message previews</Label>
                      <p className="text-xs text-muted-foreground">Show previews in chat list</p>
                  </div>
                  <Switch
                    id="messagePreview"
                    checked={settings.messagePreview}
                    onCheckedChange={(checked) => updateSetting('messagePreview', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="readReceipts">Read receipts</Label>
                    <p className="text-xs text-muted-foreground">Show when messages are read</p>
                  </div>
                  <Switch
                    id="readReceipts"
                    checked={settings.readReceipts}
                    onCheckedChange={(checked) => updateSetting('readReceipts', checked)}
                  />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="smartReplies">Smart replies</Label>
                      <p className="text-xs text-muted-foreground">Suggest quick responses</p>
                    </div>
                    <Switch
                      id="smartReplies"
                      checked={settings.smartReplies}
                      onCheckedChange={(checked) => updateSetting('smartReplies', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoComplete">Auto-complete</Label>
                      <p className="text-xs text-muted-foreground">Suggest text while typing</p>
                    </div>
                    <Switch
                      id="autoComplete"
                      checked={settings.autoComplete}
                      onCheckedChange={(checked) => updateSetting('autoComplete', checked)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifications">Push notifications</Label>
                      <p className="text-xs text-muted-foreground">Browser notifications</p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                      <Label htmlFor="desktopNotifications">Desktop notifications</Label>
                      <p className="text-xs text-muted-foreground">System notifications</p>
                    </div>
                    <Switch
                      id="desktopNotifications"
                      checked={settings.desktopNotifications}
                      onCheckedChange={(checked) => updateSetting('desktopNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="soundNotifications">Sound notifications</Label>
                      <p className="text-xs text-muted-foreground">Play sound for notifications</p>
                    </div>
                    <Switch
                      id="soundNotifications"
                      checked={settings.soundNotifications}
                      onCheckedChange={(checked) => updateSetting('soundNotifications', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email notifications</Label>
                      <p className="text-xs text-muted-foreground">Email updates</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                      <Label htmlFor="vibrationEnabled">Vibration</Label>
                      <p className="text-xs text-muted-foreground">Vibrate on mobile devices</p>
                    </div>
                    <Switch
                      id="vibrationEnabled"
                      checked={settings.vibrationEnabled}
                      onCheckedChange={(checked) => updateSetting('vibrationEnabled', checked)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="analyticsEnabled">Usage analytics</Label>
                      <p className="text-xs text-muted-foreground">Share usage data to improve service</p>
                  </div>
                  <Switch
                    id="analyticsEnabled"
                    checked={settings.analyticsEnabled}
                    onCheckedChange={(checked) => updateSetting('analyticsEnabled', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="crashReportsEnabled">Crash reports</Label>
                      <p className="text-xs text-muted-foreground">Send crash reports automatically</p>
                  </div>
                  <Switch
                    id="crashReportsEnabled"
                    checked={settings.crashReportsEnabled}
                    onCheckedChange={(checked) => updateSetting('crashReportsEnabled', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                      <Label htmlFor="personalizedAds">Personalized ads</Label>
                      <p className="text-xs text-muted-foreground">Show relevant advertisements</p>
                  </div>
                  <Switch
                    id="personalizedAds"
                    checked={settings.personalizedAds}
                    onCheckedChange={(checked) => updateSetting('personalizedAds', checked)}
                  />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Data Retention (days)</Label>
                    <Select value={settings.dataRetention} onValueChange={(value) => updateSetting('dataRetention', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                        <SelectItem value="forever">Forever</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="clearHistoryOnExit">Clear history on exit</Label>
                      <p className="text-xs text-muted-foreground">Delete chat history when closing</p>
                    </div>
                    <Switch
                      id="clearHistoryOnExit"
                      checked={settings.clearHistoryOnExit}
                      onCheckedChange={(checked) => updateSetting('clearHistoryOnExit', checked)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiEndpoint">API Endpoint</Label>
                    <Input
                      id="apiEndpoint"
                      value={settings.apiEndpoint}
                      onChange={(e) => updateSetting('apiEndpoint', e.target.value)}
                      placeholder="http://localhost:11434"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="modelName">Model Name</Label>
                    <Input
                      id="modelName"
                      value={settings.modelName}
                      onChange={(e) => updateSetting('modelName', e.target.value)}
                      placeholder="llama3:8b"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Max Tokens: {settings.maxTokens}</Label>
                    <Slider
                      value={[settings.maxTokens]}
                      onValueChange={(value) => updateSetting('maxTokens', value[0])}
                      max={1000}
                      min={50}
                      step={50}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Temperature: {settings.temperature}</Label>
                    <Slider
                      value={[settings.temperature]}
                      onValueChange={(value) => updateSetting('temperature', value[0])}
                      max={2.0}
                      min={0.1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="debugMode">Debug Mode</Label>
                      <p className="text-xs text-muted-foreground">Show debug information</p>
                    </div>
                    <Switch
                      id="debugMode"
                      checked={settings.debugMode}
                      onCheckedChange={(checked) => updateSetting('debugMode', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="experimentalFeatures">Experimental Features</Label>
                      <p className="text-xs text-muted-foreground">Enable beta features</p>
                    </div>
                    <Switch
                      id="experimentalFeatures"
                      checked={settings.experimentalFeatures}
                      onCheckedChange={(checked) => updateSetting('experimentalFeatures', checked)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Reset to Defaults</Label>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        if (confirm('Reset all settings to defaults?')) {
                          localStorage.clear();
                          window.location.reload();
                        }
                      }}
                      className="w-full"
                    >
                      Reset All Settings
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="data" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Export Data</Label>
                  <p className="text-xs text-muted-foreground">Download your chat history and settings</p>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleExportData}>
                      <Download className="w-4 h-4 mr-2" />
                      Export All Data
                    </Button>
                    <Button variant="outline" onClick={() => {
                      const chats = localStorage.getItem('chatboat-chats');
                      const blob = new Blob([chats || '[]'], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'chatboat-chats.json';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}>
                      <Download className="w-4 h-4 mr-2" />
                      Export Chats Only
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Import Data</Label>
                  <p className="text-xs text-muted-foreground">Import chat history from a file</p>
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const data = JSON.parse(event.target?.result as string);
                            localStorage.setItem('chatboat-chats', JSON.stringify(data));
                            alert('Chats imported successfully!');
                            window.location.reload();
                          } catch (error) {
                            alert('Error importing file. Please check the format.');
                          }
                        };
                        reader.readAsText(file);
                      }
                    }}
                    className="w-full"
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Clear Data</Label>
                  <p className="text-xs text-muted-foreground">Permanently delete your data</p>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        if (confirm('Clear all chat history?')) {
                          localStorage.removeItem('chatboat-chats');
                          alert('Chat history cleared!');
                          window.location.reload();
                        }
                      }}
                    >
                      Clear Chat History
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete All Data
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-gradient-primary text-primary-foreground">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};