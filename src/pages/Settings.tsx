
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Save, Server, ShieldCheck, Mail, BellRing, Globe, Clock, Database, Lock, RefreshCcw } from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  
  // General settings
  const [companyName, setCompanyName] = useState<string>("Law Firm Intelligence");
  const [timezone, setTimezone] = useState<string>("America/New_York");
  const [dateFormat, setDateFormat] = useState<string>("MM/DD/YYYY");
  
  // Security settings
  const [mfaRequired, setMfaRequired] = useState<boolean>(true);
  const [passwordExpiry, setPasswordExpiry] = useState<string>("90");
  const [sessionTimeout, setSessionTimeout] = useState<string>("30");
  
  // Email settings
  const [emailSender, setEmailSender] = useState<string>("notifications@lawfirm.com");
  const [emailSignature, setEmailSignature] = useState<string>("Law Firm Intelligence Team");
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [reportNotifications, setReportNotifications] = useState<boolean>(true);
  const [userNotifications, setUserNotifications] = useState<boolean>(true);
  
  // Data settings
  const [dataRetention, setDataRetention] = useState<string>("365");
  const [backupFrequency, setBackupFrequency] = useState<string>("daily");
  
  // API settings
  const [apiKeys, setApiKeys] = useState<{name: string, key: string, created: string}[]>([
    { name: "Production API Key", key: "sk_prod_••••••••••••••••", created: "2023-10-15" },
    { name: "Development API Key", key: "sk_dev_••••••••••••••••", created: "2023-11-01" },
  ]);
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully",
    });
  };
  
  const regenerateApiKey = (name: string) => {
    const newKey = `sk_${name.includes("Production") ? "prod" : "dev"}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    setApiKeys(apiKeys.map(key => 
      key.name === name 
        ? { ...key, key: `sk_${name.includes("Production") ? "prod" : "dev"}_••••••••••••••••`, created: new Date().toISOString().split("T")[0] } 
        : key
    ));
    
    toast({
      title: "API key regenerated",
      description: `New key: ${newKey.substring(0, 12)}... (copied to clipboard)`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure platform settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic platform settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company-name">Platform Name</Label>
                <Input 
                  id="company-name" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This name will be displayed throughout the platform
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select Timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="America/Anchorage">Alaska Time (AKT)</SelectItem>
                      <SelectItem value="Pacific/Honolulu">Hawaii Time (HT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select value={dateFormat} onValueChange={setDateFormat}>
                    <SelectTrigger id="date-format">
                      <SelectValue placeholder="Select Date Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      <SelectItem value="MMMM D, YYYY">MMMM D, YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Platform Appearance</Label>
                <div className="rounded-md border p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="appearance-theme" className="text-sm font-medium">
                        Theme Mode
                      </Label>
                    </div>
                    <Select defaultValue="system">
                      <SelectTrigger id="appearance-theme" className="w-40">
                        <SelectValue placeholder="Select Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="appearance-animations" className="text-sm font-medium">
                        Interface Animations
                      </Label>
                    </div>
                    <Switch id="appearance-animations" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
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
                Configure security and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-md border p-4">
                <h3 className="mb-4 text-sm font-medium">Authentication</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="mfa-required" className="text-sm font-medium">
                        Require Multi-Factor Authentication
                      </Label>
                    </div>
                    <Switch 
                      id="mfa-required"
                      checked={mfaRequired}
                      onCheckedChange={setMfaRequired}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                      <Select value={passwordExpiry} onValueChange={setPasswordExpiry}>
                        <SelectTrigger id="password-expiry">
                          <SelectValue placeholder="Select Expiry Period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="180">180 days</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                      <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                        <SelectTrigger id="session-timeout">
                          <SelectValue placeholder="Select Timeout Period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                          <SelectItem value="240">4 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-md border p-4">
                <h3 className="mb-4 text-sm font-medium">Access Control</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">IP Restriction</p>
                        <p className="text-xs text-muted-foreground">Limit access to specific IP addresses</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">SSO Integration</p>
                        <p className="text-xs text-muted-foreground">Single sign-on with your identity provider</p>
                      </div>
                    </div>
                    <Badge variant="outline">Not Configured</Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>
                Configure email notifications and templates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email-sender">Sender Email Address</Label>
                <Input 
                  id="email-sender" 
                  value={emailSender}
                  onChange={(e) => setEmailSender(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Email address used for sending notifications
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email-signature">Email Signature</Label>
                <Input 
                  id="email-signature" 
                  value={emailSignature}
                  onChange={(e) => setEmailSignature(e.target.value)}
                />
              </div>
              
              <div className="rounded-md border p-4">
                <h3 className="mb-4 text-sm font-medium">Email Templates</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">User Invitation</p>
                        <p className="text-xs text-muted-foreground">Template for new user invitations</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Edit Template</Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Password Reset</p>
                        <p className="text-xs text-muted-foreground">Template for password reset requests</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Edit Template</Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Report Delivery</p>
                        <p className="text-xs text-muted-foreground">Template for scheduled report delivery</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Edit Template</Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure when and how notifications are sent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-md border p-4">
                <h3 className="mb-4 text-sm font-medium">Email Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BellRing className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="email-notifications" className="text-sm font-medium">
                        Enable Email Notifications
                      </Label>
                    </div>
                    <Switch 
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                </div>
              </div>
              
              <div className="rounded-md border p-4">
                <h3 className="mb-4 text-sm font-medium">Notification Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BellRing className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Report Notifications</p>
                        <p className="text-xs text-muted-foreground">Notifications for report generation and scheduling</p>
                      </div>
                    </div>
                    <Switch 
                      checked={reportNotifications}
                      onCheckedChange={setReportNotifications}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BellRing className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">User Management Notifications</p>
                        <p className="text-xs text-muted-foreground">Notifications for user creation, updates, and deletions</p>
                      </div>
                    </div>
                    <Switch 
                      checked={userNotifications}
                      onCheckedChange={setUserNotifications}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BellRing className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Document Notifications</p>
                        <p className="text-xs text-muted-foreground">Notifications for document uploads and sharing</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Configure data retention, backups, and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-md border p-4">
                <h3 className="mb-4 text-sm font-medium">Data Retention</h3>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="data-retention">Data Retention Period (days)</Label>
                    <Select value={dataRetention} onValueChange={setDataRetention}>
                      <SelectTrigger id="data-retention">
                        <SelectValue placeholder="Select Retention Period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                        <SelectItem value="730">2 years</SelectItem>
                        <SelectItem value="1095">3 years</SelectItem>
                        <SelectItem value="forever">Forever</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Data older than this will be automatically archived
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-md border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Backup Settings</h3>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="backup-frequency">Backup Frequency</Label>
                    <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                      <SelectTrigger id="backup-frequency">
                        <SelectValue placeholder="Select Backup Frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Last Backup</p>
                      <p className="text-xs text-muted-foreground">2023-12-02 03:15 AM</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Run Backup Now
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="rounded-md border p-4">
                <h3 className="mb-4 text-sm font-medium">Data Export</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Export All Platform Data</p>
                      <p className="text-xs text-muted-foreground">Download a complete export of all data</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Export Data
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>
                Manage API keys and integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-md border p-4">
                <h3 className="mb-4 text-sm font-medium">API Keys</h3>
                <div className="space-y-4">
                  {apiKeys.map((apiKey, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{apiKey.name}</p>
                        <div className="flex items-center space-x-2">
                          <p className="font-mono text-xs text-muted-foreground">{apiKey.key}</p>
                          <p className="text-xs text-muted-foreground">Created: {apiKey.created}</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => regenerateApiKey(apiKey.name)}
                      >
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Regenerate
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="rounded-md border p-4">
                <h3 className="mb-4 text-sm font-medium">Third-Party Integrations</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Server className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Mapbox API</p>
                        <p className="text-xs text-muted-foreground">For map visualizations</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Connected</Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Server className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">OpenAI API</p>
                        <p className="text-xs text-muted-foreground">For AI assistant functionality</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Connected</Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Server className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Document OCR API</p>
                        <p className="text-xs text-muted-foreground">For document processing</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
