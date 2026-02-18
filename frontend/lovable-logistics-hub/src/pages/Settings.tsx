import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, Palette, Globe, Database, Mail, Key } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { SettingsFormSkeleton, SettingsToggleSkeleton, SmallWidgetSkeleton } from "@/components/DashboardSkeletons";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";

const integrations = [
  { name: "Google Maps API", status: "Connected", icon: Globe },
  { name: "Stripe Payments", status: "Connected", icon: Database },
  { name: "SendGrid Email", status: "Not configured", icon: Mail },
  { name: "IoT Gateway", status: "Connected", icon: Key },
];

const SettingsPage = () => {
  const { user } = useAuth();
  const perms = usePermissions();
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1200); return () => clearTimeout(t); }, []);

  const settingsSections = [
    {
      title: "Profile",
      icon: User,
      fields: [
        { label: "Username", value: user?.username || "—", type: "text" },
        { label: "Email", value: user?.email || "—", type: "email" },
        { label: "Account Type", value: perms.role.toUpperCase(), type: "readonly" },
        { label: "Fleet ID", value: perms.role === 'driver' ? "VH-001" : "GLOBAL-01", type: "readonly" },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      toggles: [
        { label: "Email notifications for shipment updates", enabled: true },
        { label: "SMS alerts for vehicle maintenance", enabled: perms.canManageFleet },
        { label: "Push notifications for delivery delays", enabled: false },
        { label: "Weekly analytics digest", enabled: perms.role === 'admin' },
      ],
    },
    {
      title: "Security & Permissions",
      icon: Shield,
      items: [
        { label: "Two-Factor Authentication", status: "Enabled", action: "Manage" },
        { label: "Your Permissions", status: `${Object.values(perms).filter(v => v === true).length} capabilities active`, action: "View Map" },
        { label: "Encryption Protocol", status: "AES-256-GCM Active", action: "View Certs" },
      ],
    },
  ];

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Main settings */}
        <div className="lg:col-span-2 space-y-4">
          {/* Loop through sections */}
          {settingsSections.map((section, idx) => (
            <motion.div 
              key={section.title}
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <section.icon className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-widest">{section.title}</h3>
              </div>
              
              {section.fields && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {section.fields.map((f) => (
                    <div key={f.label}>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground mb-1.5 block tracking-tighter">{f.label}</label>
                      <input
                        type="text"
                        defaultValue={f.value}
                        readOnly={f.type === "readonly"}
                        className={`w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground outline-none focus:border-primary/50 transition-all font-mono ${f.type === "readonly" ? "opacity-60 cursor-not-allowed bg-muted/20" : ""}`}
                      />
                    </div>
                  ))}
                  <div className="sm:col-span-2 pt-2">
                    <button className="px-4 py-2 rounded-lg kpi-gradient-blue text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity">
                      Update Profile
                    </button>
                  </div>
                </div>
              )}

              {section.toggles && (
                <div className="space-y-4">
                  {section.toggles.map((t) => (
                    <div key={t.label} className="flex items-center justify-between py-1 group">
                      <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">{t.label}</span>
                      <div className={`w-8 h-4 rounded-full relative cursor-pointer transition-all ${t.enabled ? "bg-primary shadow-[0_0_8px_theme(colors.primary.DEFAULT)]" : "bg-muted"}`}>
                        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-foreground shadow-sm transition-all ${t.enabled ? "left-4.5" : "left-0.5"}`} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {section.items && (
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-secondary/20 border border-border/50 hover:border-primary/30 transition-all">
                      <div>
                        <p className="text-xs font-bold text-foreground">{item.label}</p>
                        <p className="text-[10px] text-muted-foreground uppercase mt-0.5 font-bold tracking-tighter">{item.status}</p>
                      </div>
                      <button className="px-3 py-1.5 rounded-lg bg-secondary text-[10px] font-black uppercase text-muted-foreground hover:text-primary transition-colors border border-border/50">
                        {item.action}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
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
