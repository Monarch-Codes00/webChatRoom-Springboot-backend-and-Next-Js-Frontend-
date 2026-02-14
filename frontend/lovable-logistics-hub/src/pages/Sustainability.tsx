import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Leaf, TrendingDown, Fuel, Route, BarChart3, Zap, Trophy, UserCheck } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import DashboardLayout from "@/components/DashboardLayout";
import { KpiCardSkeleton, ChartSkeleton, EsgScoreSkeleton } from "@/components/DashboardSkeletons";

import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/apiService";

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

const SustainabilityPage = () => {
  const { data: susData, isLoading } = useQuery({
    queryKey: ["sustainability"],
    queryFn: async () => {
      // Combined call for missions, metrics and leaderboard
      return {
        emissionsData: [],
        routeComparison: [],
        metrics: [
          { label: "Total CO₂ (MTD)", value: "0t", change: "0%", icon: Leaf, color: "text-success" },
          { label: "Fuel Saved", value: "0 gal", change: "0%", icon: Fuel, color: "text-primary" },
          { label: "Green Routes", value: "0%", change: "0%", icon: Route, color: "text-success" },
          { label: "EV Fleet Share", value: "0%", change: "0%", icon: Zap, color: "text-warning" },
        ],
        leaderboard: []
      };
    },
    initialData: {
      emissionsData: [],
      routeComparison: [],
      metrics: [],
      leaderboard: []
    }
  });

  const { emissionsData, routeComparison, metrics, leaderboard } = susData;

  if (isLoading) {
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

      {/* Fuel Efficiency Leaderboard (Smart Feature) */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" /> Fuel Efficiency Leaderboard
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Top performing drivers this month based on eco-score</p>
          </div>
          <button className="px-3 py-1.5 rounded-lg bg-secondary text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
            View Analytics
          </button>
        </div>

        <div className="space-y-3">
          {leaderboard.length > 0 ? (
            leaderboard.map((driver: any) => (
              <div key={driver.driver || driver.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-border/50 group hover:border-primary/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-mono text-sm ${driver.rank === 1 ? 'bg-amber-500/20 text-amber-500' : 'bg-secondary text-muted-foreground'}`}>
                    {driver.rank}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{driver.driver}</p>
                    <div className="flex gap-1.5 mt-0.5">
                      {(driver.badges || []).map((b: string) => (
                        <span key={b} className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">{b}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold font-mono text-success">{driver.score < 90 ? driver.score : "A+"}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Score • {driver.savings} Saved</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground border border-dashed rounded-xl">
              No leaderboard data available. Sync with telematics to start tracking.
            </div>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default SustainabilityPage;
