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

  const updateMutation = useMutation({
    mutationFn: (data: any) => apiService.updateDockStatus(data.dockId, data.status, data.vehicleNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["docks"] });
      toast.success(`Dock ${reservation.dockId} updated successfully`);
      setIsDialogOpen(false);
    }
  });

  const docks = Array.isArray(docksData) ? docksData : [];

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
          <p className="text-sm text-muted-foreground">Real-time warehouse turnaround & planning</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-lg bg-secondary text-xs font-bold text-muted-foreground hover:text-foreground">Bay Mapping</button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity">
                + Reserve Dock
              </button>
            </DialogTrigger>
            <DialogContent className="glass-card border-border/50 max-w-sm">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Assign Vehicle to Dock</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="dock" className="text-xs uppercase font-bold text-muted-foreground">Select Dock</Label>
                  <select 
                    id="dock" 
                    className="w-full h-10 px-3 bg-secondary/50 border border-border/50 rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    value={reservation.dockId}
                    onChange={(e) => setReservation({...reservation, dockId: parseInt(e.target.value)})}
                  >
                    {docks.map((d: any) => (
                      <option key={d.id} value={d.id}>{d.name} ({d.status})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicle" className="text-xs uppercase font-bold text-muted-foreground">Vehicle Number</Label>
                  <Input 
                    id="vehicle" 
                    placeholder="e.g. VH-001" 
                    className="bg-secondary/50 border-border/50"
                    value={reservation.vehicleNumber}
                    onChange={(e) => setReservation({...reservation, vehicleNumber: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <button 
                  onClick={() => updateMutation.mutate(reservation)}
                  className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all"
                >
                  CONFIRM ASSIGNMENT
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {docks.map((dock, i) => (
          <motion.div 
            key={dock.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`glass-card p-5 group hover:border-primary/40 transition-all cursor-move border-t-4 ${
              dock.status === 'Occupied' ? 'border-primary' : 
              dock.status === 'Available' ? 'border-success' : 
              dock.status === 'Maintenance' ? 'border-destructive' : 'border-warning'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Box className={`w-4 h-4 ${dock.status === 'Available' ? 'text-success' : 'text-primary'}`} />
                <span className="text-sm font-bold text-foreground">{dock.name}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${
                dock.status === 'Occupied' ? 'bg-primary/10 text-primary' : 
                dock.status === 'Available' ? 'bg-success/10 text-success' : 
                dock.status === 'Maintenance' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'
              }`}>
                {dock.status}
              </span>
            </div>

            {dock.vehicle ? (
              <div className="space-y-3">
                <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs text-foreground font-bold">
                      <Truck className="w-3.5 h-3.5" /> {dock.vehicle}
                    </div>
                    <span className="text-[10px] text-primary font-mono font-bold animate-pulse">{dock.active}...</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Clock className="w-3 h-3" /> Turnaround: <span className="text-foreground font-bold">{dock.tt} left</span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: "65%" }} 
                    className="h-full bg-primary" 
                  />
                </div>
              </div>
            ) : (
              <div className="h-[92px] flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg group-hover:border-primary/30 transition-colors">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  {dock.status === 'Maintenance' ? 'Maintenance Cycle' : 'Ready for Dispatch'}
                </p>
                {dock.status === 'Available' && (
                  <button className="mt-2 text-[10px] text-primary font-bold hover:underline">DRAG VEHICLE HERE</button>
                )}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Bays: {dock.type}</span>
              <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground">
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Yard Summary Footer */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.4 }}
        className="mt-8 glass-card p-6 border-l-4 border-l-success flex items-center justify-between"
      >
        <div className="flex gap-8">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Yard Throughput</p>
            <p className="text-2xl font-bold font-mono text-foreground">12.4 <span className="text-xs text-muted-foreground font-sans">units/hr</span></p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Average Turnaround</p>
            <p className="text-2xl font-bold font-mono text-foreground">38.2 <span className="text-xs text-muted-foreground font-sans">min</span></p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-bold text-foreground">Yard Status: Optimal</p>
            <p className="text-[10px] text-success font-medium flex items-center justify-end gap-1">
              <CheckCircle2 className="w-3 h-3" /> Efficiency up 14%
            </p>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-success/20 border-t-success flex items-center justify-center text-xs font-bold font-mono">
            88%
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default WarehousePage;
