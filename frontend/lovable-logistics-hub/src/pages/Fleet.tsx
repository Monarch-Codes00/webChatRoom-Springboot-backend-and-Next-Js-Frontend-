import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Truck, Fuel, Gauge, Thermometer, MapPin, Wrench, CheckCircle, AlertTriangle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { KpiCardSkeleton, FleetCardSkeleton } from "@/components/DashboardSkeletons";

import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/apiService";

const statusConfig: Record<string, { label: string; class: string; icon: any }> = {
  active: { label: "Active", class: "text-success bg-success/10 border-success/20", icon: CheckCircle },
  idle: { label: "Idle", class: "text-warning bg-warning/10 border-warning/20", icon: AlertTriangle },
  maintenance: { label: "Maintenance", class: "text-destructive bg-destructive/10 border-destructive/20", icon: Wrench },
};

const FleetPage = () => {
  const { data: fleetData, isLoading } = useQuery({
    queryKey: ["fleet"],
    queryFn: async () => {
      const resp = await apiService.getVehicles();
      return resp.data;
    },
    initialData: [],
  });

  const fleet = Array.isArray(fleetData) ? fleetData : [];

  const active = fleet.filter((v: any) => v.status === "active").length;
  const idle = fleet.filter((v: any) => v.status === "idle").length;
  const maint = fleet.filter((v: any) => v.status === "maintenance").length;

  if (isLoading) {
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
