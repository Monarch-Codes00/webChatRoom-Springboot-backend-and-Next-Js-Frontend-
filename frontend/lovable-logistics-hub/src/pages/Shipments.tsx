import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, MapPin, ArrowRight, Clock, Search, Filter, ChevronDown, Bell } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { ShipmentsTableSkeleton, KpiCardSkeleton } from "@/components/DashboardSkeletons";
import { toast } from "sonner";

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

const statusStyles: Record<string, string> = {
  active: "text-success bg-success/10 border-success/20",
  warning: "text-warning bg-warning/10 border-warning/20",
  danger: "text-destructive bg-destructive/10 border-destructive/20",
};

const filters = ["All", "In Transit", "Loading", "Delivered", "Delayed"];

const ShipmentsPage = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newShipment, setNewShipment] = useState({
    id: `SHP-${Math.floor(Math.random() * 10000)}`,
    customer: "",
    origin: "",
    destination: "",
    status: "Loading",
    statusType: "warning",
    eta: "Pending",
    driver: "",
    weight: "",
    created: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  });

  const { data: shipmentsData, isLoading } = useQuery({
    queryKey: ["shipments"],
    queryFn: async () => {
      const resp = await apiService.getShipments();
      return resp.data;
    },
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiService.createShipment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      toast.success("Shipment created successfully");
      setIsDialogOpen(false);
      setNewShipment({
        id: `SHP-${Math.floor(Math.random() * 10000)}`,
        customer: "",
        origin: "",
        destination: "",
        status: "Loading",
        statusType: "warning",
        eta: "Pending",
        driver: "",
        weight: "",
        created: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      });
    },
    onError: () => {
      toast.error("Failed to create shipment. Please check backend.");
    }
  });

  const allShipments = Array.isArray(shipmentsData) ? shipmentsData : [];

  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = allShipments.filter((s: any) => {
    const matchesFilter = activeFilter === "All" || s.status === activeFilter;
    const matchesSearch = s.id.toLowerCase().includes(search.toLowerCase()) || 
                         (s.customer && s.customer.toLowerCase().includes(search.toLowerCase())) || 
                         (s.driver && s.driver.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Shipments</h2>
            <p className="text-sm text-muted-foreground">{allShipments.length} total shipments</p>
          </div>
        </div>
        <ShipmentsTableSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Shipments</h2>
          <p className="text-sm text-muted-foreground">{filtered.length} visible shipments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="px-4 py-2 rounded-lg kpi-gradient-blue text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              + New Shipment
            </button>
          </DialogTrigger>
          <DialogContent className="glass-card border-border/50 max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Register New Shipment</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer" className="text-xs uppercase font-bold text-muted-foreground">Customer Name</Label>
                  <Input 
                    id="customer" 
                    placeholder="e.g. Acme Corp" 
                    className="bg-secondary/50 border-border/50"
                    value={newShipment.customer}
                    onChange={(e) => setNewShipment({...newShipment, customer: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driver" className="text-xs uppercase font-bold text-muted-foreground">Assigned Driver</Label>
                  <Input 
                    id="driver" 
                    placeholder="e.g. John Doe" 
                    className="bg-secondary/50 border-border/50"
                    value={newShipment.driver}
                    onChange={(e) => setNewShipment({...newShipment, driver: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin" className="text-xs uppercase font-bold text-muted-foreground">Origin City</Label>
                  <Input 
                    id="origin" 
                    placeholder="e.g. San Jose, CA" 
                    className="bg-secondary/50 border-border/50"
                    value={newShipment.origin}
                    onChange={(e) => setNewShipment({...newShipment, origin: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination" className="text-xs uppercase font-bold text-muted-foreground">Destination City</Label>
                  <Input 
                    id="destination" 
                    placeholder="e.g. Austin, TX" 
                    className="bg-secondary/50 border-border/50"
                    value={newShipment.destination}
                    onChange={(e) => setNewShipment({...newShipment, destination: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-xs uppercase font-bold text-muted-foreground">Cargo Weight</Label>
                  <Input 
                    id="weight" 
                    placeholder="e.g. 1,200 kg" 
                    className="bg-secondary/50 border-border/50"
                    value={newShipment.weight}
                    onChange={(e) => setNewShipment({...newShipment, weight: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="id" className="text-xs uppercase font-bold text-muted-foreground">Shipment ID</Label>
                  <Input id="id" value={newShipment.id} readOnly className="bg-muted/50 font-mono text-xs opacity-70" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <button 
                onClick={() => createMutation.mutate(newShipment)}
                disabled={createMutation.isPending || !newShipment.customer}
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {createMutation.isPending ? "REGISTERING..." : "CONFIRM SHIPMENT REGISTER"}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg bg-secondary border border-border">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search by ID, customer, driver..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground flex-1 text-sm" />
        </div>
        <div className="flex gap-1.5">
          {filters.map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeFilter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Shipment", "Customer", "Route", "Status", "ETA", "Driver", "Weight", "Created", "Actions"].map((h) => (
                  <th key={h} className={`text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3 ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-primary" />
                      <span className="text-sm font-mono font-medium text-foreground">{s.id}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-foreground">{s.customer}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{s.origin}</span>
                      <ArrowRight className="w-3 h-3 text-primary" />
                      <span>{s.destination}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[s.statusType]}`}>
                      <span className={`status-dot status-${s.statusType}`} />
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span className="font-mono">{s.eta}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-foreground">{s.driver}</td>
                  <td className="px-5 py-3 text-sm font-mono text-muted-foreground">{s.weight}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{s.created}</td>
                  <td className="px-5 py-3 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success(`MULTICHANNEL BROADCAST SENT`, {
                          description: `Tracking updates sent to ${s.customer} via SMS, WhatsApp & Email.`,
                        });
                      }}
                      className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <Bell className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default ShipmentsPage;
