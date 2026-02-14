import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, MapPin, ArrowRight, Clock, Search, Filter, ChevronDown, Bell } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { ShipmentsTableSkeleton, KpiCardSkeleton } from "@/components/DashboardSkeletons";
import { toast } from "sonner";

import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/apiService";

const statusStyles: Record<string, string> = {
  active: "text-success bg-success/10 border-success/20",
  warning: "text-warning bg-warning/10 border-warning/20",
  danger: "text-destructive bg-destructive/10 border-destructive/20",
};

const filters = ["All", "In Transit", "Loading", "Delivered", "Delayed"];

const ShipmentsPage = () => {
  const { data: shipmentsData, isLoading } = useQuery({
    queryKey: ["shipments"],
    queryFn: async () => {
      const resp = await apiService.getShipments();
      return resp.data;
    },
    initialData: [],
  });

  const allShipments = Array.isArray(shipmentsData) ? shipmentsData : [];

  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = allShipments.filter((s: any) => {
    const matchesFilter = activeFilter === "All" || s.status === activeFilter;
    const matchesSearch = s.id.toLowerCase().includes(search.toLowerCase()) || s.customer.toLowerCase().includes(search.toLowerCase()) || s.driver.toLowerCase().includes(search.toLowerCase());
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
          <p className="text-sm text-muted-foreground">{allShipments.length} total shipments</p>
        </div>
        <button className="px-4 py-2 rounded-lg kpi-gradient-blue text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          + New Shipment
        </button>
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
