import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Truck, Fuel, Gauge, Thermometer, MapPin, Wrench, CheckCircle, AlertTriangle, Edit, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { KpiCardSkeleton, FleetCardSkeleton } from "@/components/DashboardSkeletons";
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

const statusConfig: Record<string, { label: string; class: string; icon: any }> = {
  active: { label: "Active", class: "text-success bg-success/10 border-success/20", icon: CheckCircle },
  idle: { label: "Idle", class: "text-warning bg-warning/10 border-warning/20", icon: AlertTriangle },
  maintenance: { label: "Maintenance", class: "text-destructive bg-destructive/10 border-destructive/20", icon: Wrench },
};

const FleetPage = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<any>(null);
  const [newVehicle, setNewVehicle] = useState({
    id: `VH-${Math.floor(Math.random() * 1000)}`,
    name: "",
    plate: "",
    status: "active",
    fuel: 100,
    mileage: "0 mi",
    lastService: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    nextService: "—",
    driver: "Unassigned",
    location: "Main Yard",
    speed: 0,
    temp: 20.0
  });

  const { data: fleetData, isLoading } = useQuery({
    queryKey: ["fleet"],
    queryFn: async () => {
      const resp = await apiService.getVehicles();
      return resp.data;
    },
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiService.createVehicle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fleet"] });
      toast.success("Vehicle added to fleet");
      setIsDialogOpen(false);
      setNewVehicle({
        id: `VH-${Math.floor(Math.random() * 1000)}`,
        name: "",
        plate: "",
        status: "active",
        fuel: 100,
        mileage: "0 mi",
        lastService: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        nextService: "—",
        driver: "Unassigned",
        location: "Main Yard",
        speed: 0,
        temp: 20.0
      });
    },
    onError: () => {
      toast.error("Failed to add vehicle.");
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => apiService.updateVehicle(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fleet"] });
      toast.success("Vehicle updated");
      setIsEditDialogOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => apiService.deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fleet"] });
      toast.error("Vehicle removed from fleet");
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Fleet Management</h2>
          <p className="text-sm text-muted-foreground">Monitor and manage all vehicles in your fleet</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity">
              + Add Vehicle
            </button>
          </DialogTrigger>
          <DialogContent className="glass-card border-border/50 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Add New Fleet Asset</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs uppercase font-bold text-muted-foreground">Vehicle Model / Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Freightliner Cascadia" 
                  className="bg-secondary/50 border-border/50"
                  value={newVehicle.name}
                  onChange={(e) => setNewVehicle({...newVehicle, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plate" className="text-xs uppercase font-bold text-muted-foreground">License Plate</Label>
                <Input 
                  id="plate" 
                  placeholder="e.g. CA-7842-XL" 
                  className="bg-secondary/50 border-border/50 font-mono"
                  value={newVehicle.plate}
                  onChange={(e) => setNewVehicle({...newVehicle, plate: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id" className="text-xs uppercase font-bold text-muted-foreground">Asset ID</Label>
                  <Input id="id" value={newVehicle.id} readOnly className="bg-muted/50 font-mono text-xs opacity-70" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold text-muted-foreground">Initial Status</Label>
                  <div className="h-10 px-3 flex items-center bg-muted/50 rounded-md border border-border/50 text-xs font-bold text-success">
                    ACTIVE
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <button 
                onClick={() => createMutation.mutate(newVehicle)}
                disabled={createMutation.isPending || !newVehicle.name || !newVehicle.plate}
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {createMutation.isPending ? "ADDING ASSET..." : "ADD TO FLEET DATABASE"}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
        {fleet.map((v: any, i) => {
          const st = statusConfig[v.status] || statusConfig.active;
          return (
            <motion.div key={v.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + (i % 6) * 0.05 }} className="glass-card p-5 group hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-foreground text-sm">{v.name}</p>
                  <p className="text-xs font-mono text-muted-foreground">{v.id} · {v.plate}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${st.class}`}>
                    <st.icon className="w-3 h-3" />
                    {st.label}
                  </span>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        setCurrentVehicle(v);
                        setIsEditDialogOpen(true);
                      }}
                      className="p-1.5 rounded-md bg-secondary text-muted-foreground hover:text-primary"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm(`Remove vehicle ${v.id} from fleet?`)) {
                          deleteMutation.mutate(v.id);
                        }
                      }}
                      className="p-1.5 rounded-md bg-secondary text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                <MapPin className="w-3 h-3 text-primary" />
                {v.location}
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-secondary/40 rounded-lg p-2 text-center text-[10px]">
                  <Fuel className="w-3.5 h-3.5 mx-auto text-primary mb-1" />
                  <p className={`font-mono font-medium ${v.fuel < 30 ? "text-warning" : "text-foreground"}`}>{v.fuel}%</p>
                </div>
                <div className="bg-secondary/40 rounded-lg p-2 text-center text-[10px]">
                  <Gauge className="w-3.5 h-3.5 mx-auto text-primary mb-1" />
                  <p className="font-mono font-medium text-foreground">{v.speed} mph</p>
                </div>
                {v.temp !== null && (
                  <div className="bg-secondary/40 rounded-lg p-2 text-center text-[10px]">
                    <Thermometer className="w-3.5 h-3.5 mx-auto text-primary mb-1" />
                    <p className="font-mono font-medium text-foreground">{v.temp}°C</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/50 pt-3">
                <span>Driver: <span className="text-foreground font-medium">{v.driver}</span></span>
                <span className="font-mono">{v.mileage}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass-card border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit Vehicle Specifications</DialogTitle>
          </DialogHeader>
          {currentVehicle && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Model Name</Label>
                <Input 
                  value={currentVehicle.name}
                  onChange={(e) => setCurrentVehicle({...currentVehicle, name: e.target.value})}
                  className="bg-secondary/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">License Plate</Label>
                <Input 
                  value={currentVehicle.plate}
                  onChange={(e) => setCurrentVehicle({...currentVehicle, plate: e.target.value})}
                  className="bg-secondary/50 border-border/50 font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Assigned Driver</Label>
                  <Input 
                    value={currentVehicle.driver}
                    onChange={(e) => setCurrentVehicle({...currentVehicle, driver: e.target.value})}
                    className="bg-secondary/50 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Current Status</Label>
                  <select 
                    value={currentVehicle.status}
                    onChange={(e) => setCurrentVehicle({...currentVehicle, status: e.target.value})}
                    className="w-full h-10 px-3 bg-secondary/50 border border-border/50 rounded-md text-sm text-foreground focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="idle">Idle</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <button 
              onClick={() => updateMutation.mutate(currentVehicle)}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all"
            >
              SAVE CHANGES
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default FleetPage;
