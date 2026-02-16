import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Fuel, Thermometer, Gauge, AlertTriangle, Wrench, Battery, Wifi } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import DashboardLayout from "@/components/DashboardLayout";
import { SensorCardSkeleton, ChartSkeleton, AlertSkeleton } from "@/components/DashboardSkeletons";
import { usePermissions } from "@/hooks/usePermissions";
import { RoleGuard } from "@/components/RoleGuard";

const engineData = Array.from({ length: 20 }, (_, i) => ({
  time: `${i}m`,
  rpm: 1800 + Math.floor(Math.random() * 600),
  temp: 185 + Math.floor(Math.random() * 30),
  oil: 45 + Math.floor(Math.random() * 15),
}));

const alerts = [
  { id: 1, vehicle: "VH-003", type: "Low Fuel", severity: "warning", message: "Fuel level at 22% — refueling recommended", time: "12 min ago" },
  { id: 2, vehicle: "VH-004", type: "Engine Fault", severity: "danger", message: "Check engine light triggered — P0420 catalyst efficiency", time: "45 min ago" },
  { id: 3, vehicle: "VH-007", type: "Tire Pressure", severity: "warning", message: "Right rear tire pressure low: 28 PSI (req: 100)", time: "1h ago" },
  { id: 4, vehicle: "VH-002", type: "Harsh Braking", severity: "warning", message: "Harsh braking event detected at 58 mph on I-10", time: "2h ago" },
];

const sensorGrid = [
  { label: "Avg Engine RPM", value: "2,140", icon: Activity, status: "normal" },
  { label: "Fuel Efficiency", value: "6.8 mpg", icon: Fuel, status: "normal" },
  { label: "Coolant Temp", value: "198°F", icon: Thermometer, status: "warning" },
  { label: "Avg Speed", value: "57 mph", icon: Gauge, status: "normal" },
  { label: "Battery Voltage", value: "12.6V", icon: Battery, status: "normal" },
  { label: "IoT Devices", value: "24/28", icon: Wifi, status: "warning" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-card p-3 border border-border text-xs space-y-1">
      <p className="font-medium text-foreground">{label}</p>
      {payload.map((e: any, i: number) => (
        <p key={i} style={{ color: e.color }}>{e.name}: <span className="font-mono">{e.value}</span></p>
      ))}
    </div>
  );
};

const TelematicsPage = () => {
  const perms = usePermissions();
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1200); return () => clearTimeout(t); }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div>
          <h2 className="text-xl font-bold text-foreground">Telematics & IoT</h2>
          <p className="text-sm text-muted-foreground">Live vehicle sensor data and diagnostics</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <SensorCardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        <AlertSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <RoleGuard 
        permission={perms.role === 'admin'} 
        fallback={
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Activity className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Telematics Feed Restricted</h2>
            <p className="text-muted-foreground max-w-md">
              Real-time IoT telemetry and high-resolution diagnostic streams are reserved for maintenance supervisors and administrative accounts.
            </p>
          </div>
        }
      >
        <div>
          <h2 className="text-xl font-bold text-foreground">Telematics & IoT</h2>
          <p className="text-sm text-muted-foreground">Live vehicle sensor data and diagnostics</p>
        </div>

        {/* Sensor Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          {sensorGrid.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4 text-center">
              <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.status === "warning" ? "text-warning" : "text-primary"}`} />
              <p className="text-lg font-bold font-mono text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-1">Engine RPM (Live)</h3>
            <p className="text-xs text-muted-foreground mb-4">VH-001 — Last 20 minutes</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={engineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,16%)" />
                <XAxis dataKey="time" tick={{ fill: "hsl(215,20%,55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215,20%,55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="rpm" stroke="hsl(195,100%,50%)" strokeWidth={2} dot={false} name="RPM" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-1">Engine Temp & Oil Pressure</h3>
            <p className="text-xs text-muted-foreground mb-4">VH-001 — Last 20 minutes</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={engineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,16%)" />
                <XAxis dataKey="time" tick={{ fill: "hsl(215,20%,55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215,20%,55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="temp" stroke="hsl(38,92%,50%)" strokeWidth={2} dot={false} name="Temp (°F)" />
                <Line type="monotone" dataKey="oil" stroke="hsl(142,70%,45%)" strokeWidth={2} dot={false} name="Oil (PSI)" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Alerts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5 mt-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <h3 className="text-sm font-semibold text-foreground">Active Alerts</h3>
          </div>
          <div className="space-y-3">
            {alerts.map((a) => (
              <div key={a.id} className={`flex items-start gap-3 p-3 rounded-lg border ${a.severity === "danger" ? "bg-destructive/5 border-destructive/20" : "bg-warning/5 border-warning/20"}`}>
                <span className={`status-dot mt-1.5 status-${a.severity}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{a.type} — <span className="font-mono text-muted-foreground">{a.vehicle}</span></p>
                    <span className="text-xs text-muted-foreground">{a.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.message}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </RoleGuard>
    </DashboardLayout>
  );
};

export default TelematicsPage;
