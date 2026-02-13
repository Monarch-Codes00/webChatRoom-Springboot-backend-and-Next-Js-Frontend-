import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Truck, Fuel, Gauge, Thermometer, MapPin, Wrench, CheckCircle, AlertTriangle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { KpiCardSkeleton, FleetCardSkeleton } from "@/components/DashboardSkeletons";

const fleet = [
  { id: "VH-001", name: "Freightliner Cascadia", plate: "CA-7842-XL", status: "active", fuel: 78, mileage: "124,320 mi", lastService: "Jan 12, 2026", nextService: "Mar 12, 2026", driver: "M. Rodriguez", location: "I-40, New Mexico", speed: 62, temp: 4.2 },
  { id: "VH-002", name: "Kenworth T680", plate: "TX-3391-HV", status: "active", fuel: 45, mileage: "98,450 mi", lastService: "Dec 28, 2025", nextService: "Feb 28, 2026", driver: "K. Johnson", location: "I-10, Texas", speed: 58, temp: -18.5 },
  { id: "VH-003", name: "Volvo VNL 860", plate: "CO-5519-RF", status: "idle", fuel: 22, mileage: "156,780 mi", lastService: "Feb 01, 2026", nextService: "Apr 01, 2026", driver: "A. Chen", location: "Denver Hub", speed: 0, temp: 2.1 },
  { id: "VH-004", name: "Peterbilt 579", plate: "NY-8821-TK", status: "maintenance", fuel: 91, mileage: "201,100 mi", lastService: "Feb 05, 2026", nextService: "—", driver: "R. Smith", location: "Maintenance Bay #3", speed: 0, temp: null },
  { id: "VH-005", name: "Mack Anthem", plate: "FL-2244-BG", status: "active", fuel: 63, mileage: "87,620 mi", lastService: "Jan 20, 2026", nextService: "Mar 20, 2026", driver: "J. Williams", location: "I-95, Georgia", speed: 55, temp: null },
  { id: "VH-006", name: "International LT", plate: "IL-6678-MV", status: "active", fuel: 88, mileage: "45,200 mi", lastService: "Feb 08, 2026", nextService: "Apr 08, 2026", driver: "D. Martinez", location: "I-55, Illinois", speed: 61, temp: 3.8 },
  { id: "VH-007", name: "Western Star 5700", plate: "WA-1190-XE", status: "idle", fuel: 34, mileage: "178,900 mi", lastService: "Nov 15, 2025", nextService: "Feb 15, 2026", driver: "—", location: "Seattle Yard", speed: 0, temp: null },
  { id: "VH-008", name: "DAF XF", plate: "AZ-4455-KL", status: "active", fuel: 52, mileage: "112,340 mi", lastService: "Jan 30, 2026", nextService: "Mar 30, 2026", driver: "S. Patel", location: "I-17, Arizona", speed: 65, temp: -20.1 },
];

const statusConfig: Record<string, { label: string; class: string; icon: any }> = {
  active: { label: "Active", class: "text-success bg-success/10 border-success/20", icon: CheckCircle },
  idle: { label: "Idle", class: "text-warning bg-warning/10 border-warning/20", icon: AlertTriangle },
  maintenance: { label: "Maintenance", class: "text-destructive bg-destructive/10 border-destructive/20", icon: Wrench },
};

const FleetPage = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1200); return () => clearTimeout(t); }, []);

  const active = fleet.filter((v) => v.status === "active").length;
  const idle = fleet.filter((v) => v.status === "idle").length;
  const maint = fleet.filter((v) => v.status === "maintenance").length;

  if (loading) {
    return (
      <DashboardLayout>
        <div>
          <h2 className="text-xl font-bold text-foreground">Fleet Management</h2>
          <p className="text-sm text-muted-foreground">Monitor and manage all vehicles in your fleet</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <KpiCardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <FleetCardSkeleton key={i} />)}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-xl font-bold text-foreground">Fleet Management</h2>
        <p className="text-sm text-muted-foreground">Monitor and manage all vehicles in your fleet</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Active", value: active, gradient: "kpi-gradient-green" },
          { label: "Idle", value: idle, gradient: "kpi-gradient-amber" },
          { label: "Maintenance", value: maint, gradient: "kpi-gradient-red" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${s.gradient} flex items-center justify-center`}>
              <Truck className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label} Vehicles</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Vehicle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {fleet.map((v, i) => {
          const st = statusConfig[v.status];
          return (
            <motion.div key={v.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }} className="glass-card p-5 hover:border-primary/30 transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-foreground text-sm">{v.name}</p>
                  <p className="text-xs font-mono text-muted-foreground">{v.id} · {v.plate}</p>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${st.class}`}>
                  <st.icon className="w-3 h-3" />
                  {st.label}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                <MapPin className="w-3 h-3 text-primary" />
                {v.location}
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-secondary/40 rounded-lg p-2 text-center">
                  <Fuel className="w-3.5 h-3.5 mx-auto text-primary mb-1" />
                  <p className={`text-xs font-mono font-medium ${v.fuel < 30 ? "text-warning" : "text-foreground"}`}>{v.fuel}%</p>
                </div>
                <div className="bg-secondary/40 rounded-lg p-2 text-center">
                  <Gauge className="w-3.5 h-3.5 mx-auto text-primary mb-1" />
                  <p className="text-xs font-mono font-medium text-foreground">{v.speed} mph</p>
                </div>
                {v.temp !== null && (
                  <div className="bg-secondary/40 rounded-lg p-2 text-center">
                    <Thermometer className="w-3.5 h-3.5 mx-auto text-primary mb-1" />
                    <p className="text-xs font-mono font-medium text-foreground">{v.temp}°C</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
                <span>Driver: <span className="text-foreground">{v.driver}</span></span>
                <span className="font-mono">{v.mileage}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default FleetPage;
