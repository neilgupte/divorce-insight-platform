
import React from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Bell, Mail, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const NotificationSettings = () => {
  const { preferences, updatePreferences } = useNotifications();
  
  const handleFrequencyChange = (value: string) => {
    updatePreferences({ frequency: value as "realtime" | "daily" | "off" });
  };
  
  const handleCategoryChange = (category: keyof typeof preferences.categories, checked: boolean) => {
    updatePreferences({ 
      categories: { 
        ...preferences.categories, 
        [category]: checked 
      } 
    });
  };
  
  const handleEmailSummaryChange = (checked: boolean) => {
    updatePreferences({ emailSummary: checked });
  };
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <CardTitle>Notification Settings</CardTitle>
        </div>
        <CardDescription>
          Configure how and when you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Notification Frequency</h3>
          <RadioGroup 
            value={preferences.frequency} 
            onValueChange={handleFrequencyChange}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="realtime" id="realtime" />
              <Label htmlFor="realtime">Real-time notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="daily" id="daily" />
              <Label htmlFor="daily">Daily digest</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="off" id="off" />
              <Label htmlFor="off">Turn off notifications</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Notification Categories</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="data" className="flex-1">Data Alerts</Label>
              <Switch 
                id="data" 
                checked={preferences.categories.data}
                onCheckedChange={(checked) => handleCategoryChange("data", checked)}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="profile" className="flex-1">Saved Profile Matches</Label>
              <Switch 
                id="profile" 
                checked={preferences.categories.profile}
                onCheckedChange={(checked) => handleCategoryChange("profile", checked)}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="report" className="flex-1">Report Activity</Label>
              <Switch 
                id="report" 
                checked={preferences.categories.report}
                onCheckedChange={(checked) => handleCategoryChange("report", checked)}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="ai" className="flex-1">AI Assistant Updates</Label>
              <Switch 
                id="ai" 
                checked={preferences.categories.ai}
                onCheckedChange={(checked) => handleCategoryChange("ai", checked)}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="document" className="flex-1">Document Uploads</Label>
              <Switch 
                id="document" 
                checked={preferences.categories.document}
                onCheckedChange={(checked) => handleCategoryChange("document", checked)}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="user" className="flex-1">User Activity</Label>
              <Switch 
                id="user" 
                checked={preferences.categories.user}
                onCheckedChange={(checked) => handleCategoryChange("user", checked)}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Email Notifications</h3>
          <div className="flex items-center justify-between space-x-2">
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Daily Email Summary</span>
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Receive a daily digest of all notifications via email
              </p>
            </div>
            <Switch 
              id="email" 
              checked={preferences.emailSummary}
              onCheckedChange={handleEmailSummaryChange}
            />
          </div>
        </div>
        
        <Button onClick={handleSaveSettings} className="mt-6">
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
