import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Clock, Package, Truck, BrainCircuit, Zap, AlertCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { KpiCardSkeleton, ChartSkeleton } from "@/components/DashboardSkeletons";

import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/apiService";

const COLORS = ["hsl(195,100%,50%)", "hsl(142,70%,45%)", "hsl(38,92%,50%)", "hsl(280,65%,60%)"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-card p-3 border border-border text-xs space-y-1">
      <p className="font-medium text-foreground">{label}</p>
      {payload.map((e: any, i: number) => (
        <p key={i} style={{ color: e.color }}>
          {e.name}: <span className="font-mono">{typeof e.value === "number" && e.value < 10 ? `$${e.value.toFixed(2)}` : e.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

const AnalyticsPage = () => {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      // In a real app, this would be multiple calls or a single summary call
      return {
        monthlyDeliveries: [],
        costPerMile: [],
        deliveryByRegion: [],
        kpis: [
          { title: "Total Deliveries", value: "0", change: "0%", positive: true, icon: Package },
          { title: "Avg Cost/Mile", value: "$0.00", change: "0%", positive: true, icon: DollarSign },
          { title: "Avg Delivery Time", value: "0h", change: "0min", positive: true, icon: Clock },
          { title: "AI Capacity Forecast", value: "0%", change: "0%", positive: true, icon: BrainCircuit },
        ]
      };
    },
    initialData: {
      monthlyDeliveries: [],
      costPerMile: [],
      deliveryByRegion: [],
      kpis: []
    }
  });

  const { monthlyDeliveries, costPerMile, deliveryByRegion, kpis } = analyticsData;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div>
          <h2 className="text-xl font-bold text-foreground">Analytics</h2>
          <p className="text-sm text-muted-foreground">Performance metrics and business intelligence</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <KpiCardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ChartSkeleton />
          <div className="lg:col-span-2"><ChartSkeleton /></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
  <DashboardLayout>
    <div className="mb-6">
      <h2 className="text-xl font-bold text-foreground">Intelligence & Analytics</h2>
      <p className="text-sm text-muted-foreground">Historical performance and AI-driven future projections</p>
    </div>

    {/* KPIs */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((k, i) => (
        <motion.div key={k.title} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="glass-card p-5 group hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{k.title}</p>
            <k.icon className={`w-4 h-4 ${k.title.includes("AI") ? "text-primary animate-pulse" : "text-muted-foreground"}`} />
          </div>
          <p className="text-2xl font-bold font-mono text-foreground">{k.value}</p>
          <p className={`text-[10px] font-bold flex items-center gap-1 mt-1 ${k.positive ? "text-success" : "text-destructive"}`}>
            {k.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {k.change} VS LAST PERIOD
          </p>
        </motion.div>
      ))}
    </div>

    {/* Main Analytics Row */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">Growth & Demand Forecast</h3>
            <p className="text-[10px] text-muted-foreground italic">92% Neural Confidence on Q2 Forecast</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary">
              <div className="w-2 h-2 rounded-full bg-primary" /> ACTUAL
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary/40">
              <div className="w-2 h-2 rounded-full border border-primary" /> AI PROJECTION
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyDeliveries}>
            <defs>
              <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(195,100%,50%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(195,100%,50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,12%)" />
            <XAxis dataKey="name" tick={{ fill: "hsl(215,20%,45%)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(215,20%,45%)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="value" stroke="hsl(195,100%,50%)" fill="url(#aGrad)" strokeWidth={3} name="Total Deliveries" />
            <Area type="monotone" dataKey="forecast" stroke="hsl(195,100%,50%)" strokeDasharray="5 5" fill="transparent" strokeWidth={1} name="AI Projection" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* AI Intelligence Sidebar */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="space-y-4">
        <div className="glass-card p-5 border-l-4 border-l-primary bg-primary/5">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-primary fill-primary" />
            <h4 className="text-xs font-bold uppercase tracking-widest">Capacity Insight</h4>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground mb-4">
            Historical patterns suggest a <span className="text-foreground font-bold font-mono">22% surge</span> in Southern Region demand next Tuesday. 
          </p>
          <div className="p-3 bg-muted/50 rounded border border-border">
            <p className="text-[10px] font-bold mb-2">PROPOSED ACTION</p>
            <p className="text-[10px] text-primary font-medium">Reassign 3 heavy-duty units to Sector-7 by Monday 18:00.</p>
          </div>
        </div>

        <div className="glass-card p-5 border-l-4 border-l-amber-500 bg-amber-500/5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-bold uppercase tracking-widest">Risk Analysis</h4>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground mb-2">
            Vehicle <span className="font-bold text-foreground">VH-002</span> shows high vibration anomalies. AI predicts <span className="text-amber-500 font-bold">85% probability</span> of alternator failure within 250 miles.
          </p>
        </div>
      </motion.div>
    </div>

    {/* Secondary Metrics */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest mb-4">Cost Efficiency Mapping</h3>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={costPerMile}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,12%)" />
                    <XAxis dataKey="name" tick={{ fill: "hsl(215,20%,45%)", fontSize: 10 }} />
                    <YAxis domain={[2.1, 2.6]} tick={{ fill: "hsl(215,20%,45%)", fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="step" dataKey="cost" stroke="hsl(142,70%,45%)" strokeWidth={2} dot={{ r: 3 }} name="Cost per Mile" />
                </LineChart>
            </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-5 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
            <h3 className="font-bold text-sm uppercase tracking-widest mb-2">Processing Live Telemetry</h3>
            <p className="text-xs text-muted-foreground max-w-[200px]">Connecting to real-time streams for dynamic heatmap generation...</p>
        </motion.div>
    </div>
  </DashboardLayout>
  );
};

export default AnalyticsPage;
