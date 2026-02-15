// Warehouse Interactive Dock Management Page
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Box, Truck, Clock, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { KpiCardSkeleton } from "@/components/DashboardSkeletons";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/apiService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const WarehousePage = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reservation, setReservation] = useState({ 
    dockId: 1, 
    vehicleNumber: "", 
    status: "Occupied" 
  });

  const { data: docksData, isLoading } = useQuery({
    queryKey: ["docks"],
    queryFn: async () => {
      const resp = await apiService.getDocks();
      return resp.data;
    },
    initialData: [],
  });

  const { data: fleetData } = useQuery({
    queryKey: ["fleet"],
    queryFn: async () => {
      const resp = await apiService.getVehicles();
      return resp.data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => apiService.updateDockStatus(data.dockId, data.status, data.vehicleNumber),
    onSuccess: (resp, variables) => {
      queryClient.invalidateQueries({ queryKey: ["docks"] });
      toast.success(variables.status === 'Available' ? `Dock released` : `Dock ${variables.dockId} assigned to ${variables.vehicleNumber}`);
      setIsDialogOpen(false);
    }
  });

  const docks = Array.isArray(docksData) ? docksData : [];
  const fleet = Array.isArray(fleetData) ? fleetData : [];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />)}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Interactive Dock Management</h2>
          <p className="text-sm text-muted-foreground">Operational Control: Gate-to-Bay Synchronization</p>
        </div>
        <div className="flex gap-2">
          <div className="flex -space-x-2 mr-4 overflow-hidden items-center">
            {fleet.slice(0, 3).map((v: any) => (
              <div key={v.id} className="inline-block h-6 w-6 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[8px] font-bold ring-2 ring-primary/20" title={`In Yard: ${v.id}`}>
                {v.id.substring(3)}
              </div>
            ))}
            <span className="pl-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{fleet.length} TRUCKS IN YARD</span>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-all shadow-lg glow-primary">
                + Bay Assignment
              </button>
            </DialogTrigger>
            <DialogContent className="glass-card border-border/50 max-w-sm">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <Box className="w-5 h-5 text-primary" />
                  Assign Vehicle to Bay
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="dock" className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Select Loading Bay</Label>
                  <select 
                    id="dock" 
                    className="w-full h-10 px-3 bg-secondary/50 border border-border/50 rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    value={reservation.dockId}
                    onChange={(e) => setReservation({...reservation, dockId: parseInt(e.target.value)})}
                  >
                    {docks.map((d: any) => (
                      <option key={d.id} value={d.id}>{d.name} — {d.type} ({d.status})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicle" className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Available Vehicle</Label>
                  <select 
                    id="vehicle" 
                    className="w-full h-10 px-3 bg-secondary/50 border border-border/50 rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    value={reservation.vehicleNumber}
                    onChange={(e) => setReservation({...reservation, vehicleNumber: e.target.value})}
                  >
                    <option value="">Select ID from Fleet</option>
                    {fleet.map((v: any) => (
                      <option key={v.id} value={v.id}>{v.id} ({v.name})</option>
                    ))}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <button 
                  onClick={() => updateMutation.mutate(reservation)}
                  disabled={!reservation.vehicleNumber}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all shadow-lg disabled:opacity-50"
                >
                  INITIALIZE LOAD CYCLE
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {docks.map((dock: any, i: number) => {
          const isCold = dock.type?.toLowerCase().includes('cold');
          return (
            <motion.div 
              key={dock.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-card p-5 group hover:border-primary/40 transition-all border-t-4 relative ${
                dock.status === 'Occupied' ? 'border-primary' : 
                dock.status === 'Available' ? 'border-success' : 
                dock.status === 'Maintenance' ? 'border-destructive' : 'border-warning'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Box className={`w-4 h-4 ${dock.status === 'Available' ? 'text-success' : 'text-primary'}`} />
                    <span className="text-sm font-bold text-foreground">{dock.name}</span>
                  </div>
                  <span className={`text-[8px] font-bold mt-1 px-1.5 py-0.5 rounded w-fit ${isCold ? 'bg-blue-500/10 text-blue-400' : 'bg-muted text-muted-foreground'} uppercase tracking-tighter`}>
                    {dock.type}
                  </span>
                </div>
                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm ${
                  dock.status === 'Occupied' ? 'bg-primary text-primary-foreground' : 
                  dock.status === 'Available' ? 'bg-success/10 text-success border border-success/20' : 
                  dock.status === 'Maintenance' ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'bg-warning/10 text-warning'
                }`}>
                  {dock.status}
                </span>
              </div>

              {dock.vehicle ? (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-900/40 rounded-xl border border-white/5 shadow-inner">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs text-foreground font-bold">
                        <Truck className="w-3.5 h-3.5 text-primary" /> {dock.vehicle}
                      </div>
                      <span className="text-[10px] text-primary font-mono font-bold animate-pulse">{dock.active || 'LOADING'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground font-bold">
                      <Clock className="w-3 h-3" /> Turnaround: <span className="text-foreground">{dock.tt || '12m'} EST</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: "72%" }} 
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-primary shadow-[0_0_10px_theme(colors.primary.DEFAULT)]" 
                    />
                  </div>
                  <button 
                    onClick={() => updateMutation.mutate({ dockId: dock.id, status: 'Available', vehicleNumber: "" })}
                    className="w-full py-2 mt-1 rounded-lg bg-secondary/50 text-[10px] font-extrabold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all uppercase tracking-widest border border-border/30 hover:border-destructive/30"
                  >
                    Release & Log Turnaround
                  </button>
                </div>
              ) : (
                <div className="h-[96px] flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-xl group-hover:border-primary/30 transition-all bg-muted/5">
                  <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest opacity-60">
                    {dock.status === 'Maintenance' ? 'Maintenance Cycle Active' : 'Optimal Path Available'}
                  </p>
                  {dock.status === 'Available' && (
                    <button 
                      onClick={() => {
                        setReservation({ ...reservation, dockId: dock.id });
                        setIsDialogOpen(true);
                      }}
                      className="mt-3 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold hover:bg-primary hover:text-primary-foreground transition-all uppercase tracking-widest"
                    >
                      Dock Vehicle
                    </button>
                  )}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="flex flex-col">
                      <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-tighter">Throughput</span>
                      <span className="text-[10px] font-mono font-bold text-foreground">98.2%</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-tighter">Turnaround</span>
                      <span className="text-[10px] font-mono font-bold text-foreground">22m avG</span>
                   </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      const nextStatus = dock.status === 'Maintenance' ? 'Available' : 'Maintenance';
                      updateMutation.mutate({ dockId: dock.id, status: nextStatus, vehicleNumber: "" });
                    }}
                    className={`p-2 rounded-lg transition-colors ${dock.status === 'Maintenance' ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-muted-foreground hover:text-destructive'}`}
                    title="Toggle Maintenance"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-primary transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.4 }}
        className="mt-8 glass-card p-6 border-l-4 border-l-success flex items-center justify-between overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-success/5 rounded-full translate-x-32 -translate-y-32" />
        <div className="flex gap-12 relative z-10">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mb-2">Facility Throughput</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black font-mono text-foreground tracking-tighter">12.4</p>
              <span className="text-[10px] text-muted-foreground font-bold uppercase">units / hr</span>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mb-2">Average Bay Turnaround</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black font-mono text-foreground tracking-tighter">38.2</p>
              <span className="text-[10px] text-muted-foreground font-bold uppercase">minutes</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="text-right">
            <p className="text-sm font-black text-foreground uppercase italic">Optimal State</p>
            <p className="text-[10px] text-success font-black flex items-center justify-end gap-1.5 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> EFFICIENCY +14.2%
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-success/10 border-2 border-success/30 flex items-center justify-center text-xl font-black font-mono text-success shadow-[0_0_20px_rgba(34,197,94,0.2)]">
            88%
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default WarehousePage;
