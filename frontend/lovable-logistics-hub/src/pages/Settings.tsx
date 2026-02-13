import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, Palette, Globe, Database, Mail, Key } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { SettingsFormSkeleton, SettingsToggleSkeleton, SmallWidgetSkeleton } from "@/components/DashboardSkeletons";

const settingsSections = [
  {
    title: "Profile",
    icon: User,
    fields: [
      { label: "Full Name", value: "Alex Morgan", type: "text" },
      { label: "Email", value: "alex.morgan@nexuslogistics.com", type: "email" },
      { label: "Role", value: "Administrator", type: "readonly" },
      { label: "Phone", value: "+1 (555) 234-5678", type: "text" },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    toggles: [
      { label: "Email notifications for shipment updates", enabled: true },
      { label: "SMS alerts for vehicle maintenance", enabled: true },
      { label: "Push notifications for delivery delays", enabled: false },
      { label: "Weekly analytics digest", enabled: true },
      { label: "Real-time geofence alerts", enabled: true },
    ],
  },
  {
    title: "Security",
    icon: Shield,
    items: [
      { label: "Two-Factor Authentication", status: "Enabled", action: "Manage" },
      { label: "API Keys", status: "2 active keys", action: "View" },
      { label: "Session Timeout", status: "30 minutes", action: "Change" },
      { label: "Login History", status: "Last: 2h ago", action: "View" },
    ],
  },
];

const integrations = [
  { name: "Google Maps API", status: "Connected", icon: Globe },
  { name: "Stripe Payments", status: "Connected", icon: Database },
  { name: "SendGrid Email", status: "Not configured", icon: Mail },
  { name: "IoT Gateway", status: "Connected", icon: Key },
];

const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1200); return () => clearTimeout(t); }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div>
          <h2 className="text-xl font-bold text-foreground">Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your account and platform preferences</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <SettingsFormSkeleton />
            <SettingsToggleSkeleton />
            <SettingsFormSkeleton />
          </div>
          <div className="space-y-4">
            <SmallWidgetSkeleton />
            <SmallWidgetSkeleton />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-xl font-bold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your account and platform preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main settings */}
        <div className="lg:col-span-2 space-y-4">
          {/* Profile */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Profile</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {settingsSections[0].fields!.map((f) => (
                <div key={f.label}>
                  <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
                  <input
                    type="text"
                    defaultValue={f.value}
                    readOnly={f.type === "readonly"}
                    className={`w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:border-primary/50 transition-colors ${f.type === "readonly" ? "opacity-60 cursor-not-allowed" : ""}`}
                  />
                </div>
              ))}
            </div>
            <button className="mt-4 px-4 py-2 rounded-lg kpi-gradient-blue text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              Save Changes
            </button>
          </motion.div>

          {/* Notifications */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
            </div>
            <div className="space-y-3">
              {settingsSections[1].toggles!.map((t) => (
                <div key={t.label} className="flex items-center justify-between py-2">
                  <span className="text-sm text-foreground">{t.label}</span>
                  <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${t.enabled ? "bg-primary" : "bg-secondary"}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-foreground transition-transform ${t.enabled ? "left-5" : "left-0.5"}`} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Security */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Security</h3>
            </div>
            <div className="space-y-3">
              {settingsSections[2].items!.map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.status}</p>
                  </div>
                  <button className="px-3 py-1 rounded-lg bg-secondary text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {item.action}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Integrations</h3>
            <div className="space-y-3">
              {integrations.map((int) => (
                <div key={int.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/30 transition-colors">
                  <int.icon className="w-4 h-4 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{int.name}</p>
                    <p className={`text-xs ${int.status === "Connected" ? "text-success" : "text-muted-foreground"}`}>{int.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-2">Platform</h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between"><span>Version</span><span className="font-mono text-foreground">v2.4.1</span></div>
              <div className="flex justify-between"><span>Environment</span><span className="font-mono text-foreground">Production</span></div>
              <div className="flex justify-between"><span>Region</span><span className="font-mono text-foreground">US-West-2</span></div>
              <div className="flex justify-between"><span>Uptime</span><span className="font-mono text-success">99.97%</span></div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
