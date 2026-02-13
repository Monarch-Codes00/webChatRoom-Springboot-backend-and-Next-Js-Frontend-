import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Leaf, TrendingDown, Fuel, Route, BarChart3, Zap } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import DashboardLayout from "@/components/DashboardLayout";
import { KpiCardSkeleton, ChartSkeleton, EsgScoreSkeleton } from "@/components/DashboardSkeletons";

const emissionsData = [
  { name: "Aug", co2: 48.2 }, { name: "Sep", co2: 45.1 }, { name: "Oct", co2: 46.8 },
  { name: "Nov", co2: 42.3 }, { name: "Dec", co2: 40.1 }, { name: "Jan", co2: 38.5 }, { name: "Feb", co2: 35.8 },
];

const routeComparison = [
  { route: "LA → CHI", standard: 2.8, green: 2.1 },
  { route: "HOU → MIA", standard: 1.9, green: 1.5 },
  { route: "SEA → DEN", standard: 2.4, green: 1.8 },
  { route: "NY → ATL", standard: 1.6, green: 1.2 },
  { route: "PHX → DAL", standard: 1.4, green: 1.1 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-card p-3 border border-border text-xs space-y-1">
      <p className="font-medium text-foreground">{label}</p>
      {payload.map((e: any, i: number) => (
        <p key={i} style={{ color: e.color }}>{e.name}: <span className="font-mono">{e.value} tons</span></p>
      ))}
    </div>
  );
};

const metrics = [
  { label: "Total CO₂ (MTD)", value: "35.8t", change: "-7.0%", icon: Leaf, color: "text-success" },
  { label: "Fuel Saved", value: "4,200 gal", change: "+12.3%", icon: Fuel, color: "text-primary" },
  { label: "Green Routes", value: "67%", change: "+5.2%", icon: Route, color: "text-success" },
  { label: "EV Fleet Share", value: "14%", change: "+3.1%", icon: Zap, color: "text-warning" },
];

const SustainabilityPage = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1200); return () => clearTimeout(t); }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div>
          <h2 className="text-xl font-bold text-foreground">Sustainability & Carbon</h2>
          <p className="text-sm text-muted-foreground">ESG reporting and emissions tracking</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <KpiCardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        <EsgScoreSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-xl font-bold text-foreground">Sustainability & Carbon</h2>
        <p className="text-sm text-muted-foreground">ESG reporting and emissions tracking</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{m.label}</p>
              <m.icon className={`w-4 h-4 ${m.color}`} />
            </div>
            <p className="text-2xl font-bold font-mono text-foreground">{m.value}</p>
            <p className="text-xs text-success flex items-center gap-1 mt-1">
              <TrendingDown className="w-3 h-3" /> {m.change} vs last month
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Emissions Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">CO₂ Emissions Trend</h3>
          <p className="text-xs text-muted-foreground mb-4">Monthly fleet emissions (tons)</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={emissionsData}>
              <defs>
                <linearGradient id="emGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142,70%,45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(142,70%,45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,16%)" />
              <XAxis dataKey="name" tick={{ fill: "hsl(215,20%,55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215,20%,55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="co2" stroke="hsl(142,70%,45%)" fill="url(#emGrad)" strokeWidth={2} name="CO₂" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Route Comparison */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">Route Emissions Comparison</h3>
          <p className="text-xs text-muted-foreground mb-4">Standard vs Green route CO₂ (tons)</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={routeComparison} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,16%)" />
              <XAxis type="number" tick={{ fill: "hsl(215,20%,55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="route" tick={{ fill: "hsl(215,20%,55%)", fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="standard" fill="hsl(215,20%,55%)" radius={[0, 4, 4, 0]} name="Standard" />
              <Bar dataKey="green" fill="hsl(142,70%,45%)" radius={[0, 4, 4, 0]} name="Green" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ESG Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">ESG Score Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Environmental", score: 82, target: 85, color: "kpi-gradient-green" },
            { label: "Social", score: 78, target: 80, color: "kpi-gradient-blue" },
            { label: "Governance", score: 91, target: 90, color: "kpi-gradient-amber" },
          ].map((e) => (
            <div key={e.label} className="p-4 rounded-lg bg-secondary/30 border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{e.label}</span>
                <span className="text-lg font-bold font-mono text-foreground">{e.score}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-secondary">
                <motion.div initial={{ width: 0 }} animate={{ width: `${e.score}%` }} transition={{ duration: 1, delay: 0.8 }} className={`h-full rounded-full ${e.color}`} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Target: {e.target}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default SustainabilityPage;
