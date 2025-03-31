
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, User, Bell, Lock, Shield, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import NotificationSettings from "@/components/settings/NotificationSettings";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully."
      });
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center">
        <SettingsIcon className="mr-2 h-6 w-6" />
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>
      
      <Tabs defaultValue="account" className="space-y-4">
        <TabsList>
          <TabsTrigger value="account" className="gap-2">
            <User className="h-4 w-4" />
            <span>Account</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="gap-2">
            <Shield className="h-4 w-4" />
            <span>Permissions</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Update your account details and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user?.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" defaultValue={user?.role} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="joined">Joined</Label>
                  <Input id="joined" defaultValue="Jan 12, 2023" disabled />
                </div>
              </div>
              
              <div className="mt-6">
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Email Preferences</CardTitle>
              <CardDescription>
                Manage your email notification settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketing-emails">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about new features and improvements
                  </p>
                </div>
                <Switch id="marketing-emails" defaultChecked={false} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="report-emails">Report Summaries</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly summaries of generated reports
                  </p>
                </div>
                <Switch id="report-emails" defaultChecked={true} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <NotificationSettings />
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <CardTitle>Email Reports</CardTitle>
              </div>
              <CardDescription>
                Configure options for emailing reports and documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-email">Automatic Report Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically email reports to team members when generated
                  </p>
                </div>
                <Switch id="auto-email" defaultChecked={true} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="document-email">Document Sharing</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow emailing of documents from Document Vault
                  </p>
                </div>
                <Switch id="document-email" defaultChecked={true} />
              </div>
              
              <div className="space-y-2 mt-4">
                <Label htmlFor="email-template">Default Email Template</Label>
                <Input id="email-template" defaultValue="Standard Firm Template" />
              </div>
              
              <div className="mt-6">
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and authentication methods.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div>
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch id="two-factor" defaultChecked={true} />
              </div>
              
              <div className="mt-6">
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
              <CardDescription>
                View your account permissions and access levels.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Your Role</h3>
                  <p className="text-sm text-muted-foreground">
                    {user?.role === "superuser" ? "Superuser (Full Access)" : user?.role}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Access Permissions</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      Dashboard: Full Access
                    </li>
                    <li className="flex items-center text-sm">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      Location Analyzer: Full Access
                    </li>
                    <li className="flex items-center text-sm">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      Reports: Full Access
                    </li>
                    <li className="flex items-center text-sm">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      Documents: Full Access
                    </li>
                    <li className="flex items-center text-sm">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      AI Assistant: Full Access
                    </li>
                    <li className="flex items-center text-sm">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      User Management: Full Access
                    </li>
                    <li className="flex items-center text-sm">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      Settings: Full Access
                    </li>
                    <li className="flex items-center text-sm">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      Audit Logs: Full Access
                    </li>
                  </ul>
                </div>
                
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground">
                    To request changes to your permissions, please contact your administrator.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
