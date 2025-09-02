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
    displayName: 'John Doe',
    email: 'john.doe@example.com',
    
    // Preferences
    language: 'en',
    fontSize: [14],
    autoSave: true,
    soundEnabled: true,
    
    // Privacy
    analyticsEnabled: true,
    crashReportsEnabled: true,
    personalizedAds: false,
    
    // Chat
    messageHistory: true,
    messagePreview: true,
    typingIndicators: true,
    readReceipts: true,
    
    // Notifications
    pushNotifications: true,
    emailNotifications: false,
    desktopNotifications: true,
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const handleSave = () => {
    // Save settings logic here
    console.log('Saving settings:', settings);
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Preferences
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

            <TabsContent value="preferences" className="space-y-6">
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
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Font Size: {settings.fontSize[0]}px</Label>
                    <Slider
                      value={settings.fontSize}
                      onValueChange={(value) => updateSetting('fontSize', value)}
                      max={20}
                      min={12}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoSave">Auto-save conversations</Label>
                    <Switch
                      id="autoSave"
                      checked={settings.autoSave}
                      onCheckedChange={(checked) => updateSetting('autoSave', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="soundEnabled">Sound effects</Label>
                    <Switch
                      id="soundEnabled"
                      checked={settings.soundEnabled}
                      onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="chat" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="messageHistory">Save message history</Label>
                    <p className="text-xs text-muted-foreground">Keep your conversations for future reference</p>
                  </div>
                  <Switch
                    id="messageHistory"
                    checked={settings.messageHistory}
                    onCheckedChange={(checked) => updateSetting('messageHistory', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="messagePreview">Message previews</Label>
                    <p className="text-xs text-muted-foreground">Show message previews in chat list</p>
                  </div>
                  <Switch
                    id="messagePreview"
                    checked={settings.messagePreview}
                    onCheckedChange={(checked) => updateSetting('messagePreview', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="typingIndicators">Typing indicators</Label>
                    <p className="text-xs text-muted-foreground">Show when AI is generating response</p>
                  </div>
                  <Switch
                    id="typingIndicators"
                    checked={settings.typingIndicators}
                    onCheckedChange={(checked) => updateSetting('typingIndicators', checked)}
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
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifications">Push notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive notifications in your browser</p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email notifications</Label>
                    <p className="text-xs text-muted-foreground">Get important updates via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="desktopNotifications">Desktop notifications</Label>
                    <p className="text-xs text-muted-foreground">Show system notifications</p>
                  </div>
                  <Switch
                    id="desktopNotifications"
                    checked={settings.desktopNotifications}
                    onCheckedChange={(checked) => updateSetting('desktopNotifications', checked)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="analyticsEnabled">Usage analytics</Label>
                    <p className="text-xs text-muted-foreground">Help improve the service by sharing usage data</p>
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
                    <p className="text-xs text-muted-foreground">Automatically send crash reports</p>
                  </div>
                  <Switch
                    id="crashReportsEnabled"
                    checked={settings.crashReportsEnabled}
                    onCheckedChange={(checked) => updateSetting('crashReportsEnabled', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="personalizedAds">Personalized advertisements</Label>
                    <p className="text-xs text-muted-foreground">Show ads based on your interests</p>
                  </div>
                  <Switch
                    id="personalizedAds"
                    checked={settings.personalizedAds}
                    onCheckedChange={(checked) => updateSetting('personalizedAds', checked)}
                  />
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