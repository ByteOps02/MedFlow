import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lock, Bell, Globe, Sliders } from 'lucide-react';

const fetchSettings = async () => {
  const { data, error } = await supabase
    .from("settings")
    .select("key, value");

  if (error) throw new Error(error.message);
  return data;
};

const updateSettings = async (key: string, value: any) => {
  const { data, error } = await supabase
    .from("settings")
    .upsert({ key, value }, { onConflict: 'key' });

  if (error) throw new Error(error.message);
  return data;
};

const Settings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    company_name: "",
    company_email: "",
    company_phone: "",
    company_website: "",
    two_factor_auth: false,
    session_timeout: 30,
    login_alerts: false,
    email_notifications: false,
    low_stock_alerts: false,
    expiry_warnings: false,
    order_updates: false,
    default_currency: "USD",
    timezone: "UTC",
    language: "English",
    date_format: "MM/DD/YYYY",
  });

  const {
    data: userSettings,
    isLoading: settingsLoading,
    error: settingsError,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: () => fetchSettings(),
    enabled: !!user,
  });

  const updateMutation = useMutation({
    mutationFn: (data: { key: string; value: any }) =>
      updateSettings(data.key, data.value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Settings saved successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to save settings: ${error.message}`);
    },
  });

  useEffect(() => {
    if (userSettings) {
      const settingsMap: Record<string, any> = {};
      userSettings.forEach((setting) => {
        settingsMap[setting.key] = setting.value;
      });
      setFormData((prev) => ({ ...prev, ...settingsMap }));
    }
  }, [userSettings]);

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveGeneral = async () => {
    try {
      await updateMutation.mutateAsync({ key: "company_name", value: formData.company_name });
      await updateMutation.mutateAsync({ key: "company_email", value: formData.company_email });
      await updateMutation.mutateAsync({ key: "company_phone", value: formData.company_phone });
      await updateMutation.mutateAsync({ key: "company_website", value: formData.company_website });
    } catch (error) {
      console.error("Error saving general settings:", error);
    }
  };

  const handleSaveSecurity = async () => {
    try {
      await updateMutation.mutateAsync({ key: "two_factor_auth", value: formData.two_factor_auth });
      await updateMutation.mutateAsync({ key: "session_timeout", value: formData.session_timeout });
      await updateMutation.mutateAsync({ key: "login_alerts", value: formData.login_alerts });
    } catch (error) {
      console.error("Error saving security settings:", error);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      await updateMutation.mutateAsync({ key: "email_notifications", value: formData.email_notifications });
      await updateMutation.mutateAsync({ key: "low_stock_alerts", value: formData.low_stock_alerts });
      await updateMutation.mutateAsync({ key: "expiry_warnings", value: formData.expiry_warnings });
      await updateMutation.mutateAsync({ key: "order_updates", value: formData.order_updates });
    } catch (error) {
      console.error("Error saving notification settings:", error);
    }
  };

  const handleSaveSystem = async () => {
    try {
      await updateMutation.mutateAsync({ key: "default_currency", value: formData.default_currency });
      await updateMutation.mutateAsync({ key: "timezone", value: formData.timezone });
      await updateMutation.mutateAsync({ key: "language", value: formData.language });
      await updateMutation.mutateAsync({ key: "date_format", value: formData.date_format });
    } catch (error) {
      console.error("Error saving system settings:", error);
    }
  };

  if (settingsLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading settings...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (settingsError) {
    return (
      <DashboardLayout>
        <div className="text-destructive">
          Error loading settings: {(settingsError as Error).message}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage system configuration and preferences
          </p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="flex gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex gap-2">
              <Sliders className="h-4 w-4" />
              <span className="hidden sm:inline">System</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Update your company details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      placeholder="Enter company name"
                      value={formData.company_name}
                      onChange={(e) => handleInputChange("company_name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="company-email">Email</Label>
                    <Input
                      id="company-email"
                      type="email"
                      placeholder="Enter email"
                      value={formData.company_email}
                      onChange={(e) => handleInputChange("company_email", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="company-phone">Phone</Label>
                    <Input
                      id="company-phone"
                      placeholder="Enter phone number"
                      value={formData.company_phone}
                      onChange={(e) => handleInputChange("company_phone", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="company-website">Website</Label>
                    <Input
                      id="company-website"
                      placeholder="Enter website URL"
                      value={formData.company_website}
                      onChange={(e) => handleInputChange("company_website", e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={handleSaveGeneral} disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage security preferences and access control</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Switch
                    checked={formData.two_factor_auth}
                    onCheckedChange={(val) => handleInputChange("two_factor_auth", val)}
                  />
                </div>
                <div className="border-t pt-6">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <p className="text-sm text-muted-foreground mb-2">Automatically log out after inactivity</p>
                  <Input
                    id="session-timeout"
                    type="number"
                    min="5"
                    max="480"
                    value={formData.session_timeout}
                    onChange={(e) => handleInputChange("session_timeout", parseInt(e.target.value))}
                  />
                </div>
                <div className="border-t pt-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Login Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                  </div>
                  <Switch
                    checked={formData.login_alerts}
                    onCheckedChange={(val) => handleInputChange("login_alerts", val)}
                  />
                </div>
                <Button onClick={handleSaveSecurity} disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Saving..." : "Update Security Settings"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Control how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email updates</p>
                  </div>
                  <Switch
                    checked={formData.email_notifications}
                    onCheckedChange={(val) => handleInputChange("email_notifications", val)}
                  />
                </div>
                <div className="border-t pt-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Low Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">Alert when inventory drops below threshold</p>
                  </div>
                  <Switch
                    checked={formData.low_stock_alerts}
                    onCheckedChange={(val) => handleInputChange("low_stock_alerts", val)}
                  />
                </div>
                <div className="border-t pt-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Expiry Warnings</Label>
                    <p className="text-sm text-muted-foreground">Get notified about expiring batches</p>
                  </div>
                  <Switch
                    checked={formData.expiry_warnings}
                    onCheckedChange={(val) => handleInputChange("expiry_warnings", val)}
                  />
                </div>
                <div className="border-t pt-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Order Updates</Label>
                    <p className="text-sm text-muted-foreground">Track purchase and sales order changes</p>
                  </div>
                  <Switch
                    checked={formData.order_updates}
                    onCheckedChange={(val) => handleInputChange("order_updates", val)}
                  />
                </div>
                <Button onClick={handleSaveNotifications} disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Saving..." : "Save Preferences"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>Manage system-wide settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select value={formData.default_currency} onValueChange={(val) => handleInputChange("default_currency", val)}>
                      <SelectTrigger id="currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={formData.timezone} onValueChange={(val) => handleInputChange("timezone", val)}>
                      <SelectTrigger id="timezone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="EST">EST (UTC-5)</SelectItem>
                        <SelectItem value="CST">CST (UTC-6)</SelectItem>
                        <SelectItem value="PST">PST (UTC-8)</SelectItem>
                        <SelectItem value="IST">IST (UTC+5:30)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select value={formData.language} onValueChange={(val) => handleInputChange("language", val)}>
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="German">German</SelectItem>
                        <SelectItem value="Hindi">Hindi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select value={formData.date_format} onValueChange={(val) => handleInputChange("date_format", val)}>
                      <SelectTrigger id="date-format">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleSaveSystem} disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Saving..." : "Update System Settings"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
