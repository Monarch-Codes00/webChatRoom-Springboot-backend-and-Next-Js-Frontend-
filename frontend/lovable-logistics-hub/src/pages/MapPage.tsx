import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, Navigation, Layers, Target, Radio, Map as MapIcon, Compass } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { MapSkeleton, MapVehicleListSkeleton } from "@/components/DashboardSkeletons";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/apiService";
import { usePermissions } from "@/hooks/usePermissions";
import { RoleGuard } from "@/components/RoleGuard";

// Fix for default Leaflet marker icons in Vite
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapFocusHandler = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 12, { duration: 2 });
    }
  }, [position, map]);
  return null;
};

const MapPage = () => {
  const perms = usePermissions();
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<"standard" | "satellite">("standard");

  const { data: vehiclesData, isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const resp = await apiService.getVehicles();
      return resp.data;
    },
    initialData: [],
  });

  const allVehicles = Array.isArray(vehiclesData) ? vehiclesData : [];
  
  // For role-based filtering: Drivers only see their own (VH-001 for demo)
  const displayVehicles = perms.role === "driver" 
    ? allVehicles.filter(v => v.id === "VH-001") 
    : allVehicles;

  const driverVehicle = allVehicles.find(v => v.id === "VH-001");
  const mapCenter: [number, number] = perms.role === "driver" && driverVehicle 
    ? (driverVehicle.position as [number, number])
    : [37.0902, -95.7129];
  const defaultZoom = perms.role === "driver" ? 12 : 4;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <div className="h-10 w-64 bg-muted animate-pulse rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3"><MapSkeleton /></div>
            <MapVehicleListSkeleton />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                <Radio className="w-5 h-5 text-primary animate-pulse" />
             </div>
             <div>
                <h2 className="text-xl font-bold text-foreground">
                  {perms.role === "driver" ? "My Route Command" : "Global Fleet Oversight"}
                </h2>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-0.5">
                  {perms.role === "driver" ? "Live Telemetry: VH-001 Active" : `${allVehicles.length} Assets Under Synchronized Tracking`}
                </p>
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setViewMode(prev => prev === "standard" ? "satellite" : "standard")}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest border border-border/50 shadow-sm ${viewMode === "satellite" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-card hover:bg-muted"}`}
          >
            <Layers className="w-4 h-4" /> 
            {viewMode === "satellite" ? "Hybrid Active" : "Satellite Mode"}
          </button>
          <RoleGuard permission={perms.canManageFleet}>
             <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-[10px] font-extrabold uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
               <Navigation className="w-4 h-4" /> Global Optimization
             </button>
          </RoleGuard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map Area */}
        <div className="lg:col-span-3 glass-card relative overflow-hidden bg-slate-950/20 border-border/50 shadow-2xl" style={{ height: 650 }}>
          {mounted && (
            <MapContainer 
              center={mapCenter} 
              zoom={defaultZoom} 
              scrollWheelZoom={true} 
              className="w-full h-full z-10"
              zoomControl={false}
            >
              <TileLayer
                url={viewMode === "satellite" 
                  ? "https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}" 
                  : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"}
                attribution="&copy; NexusLogistics GIS Infrastructure"
                subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
              />
              <ZoomControl position="bottomright" />
              {perms.role === "driver" && driverVehicle && <MapFocusHandler position={driverVehicle.position as [number, number]} />}
              
              {displayVehicles.map((v) => (
                <Marker key={v.id} position={v.position as [number, number]}>
                  <Popup className="custom-popup">
                    <div className="p-3 bg-slate-950 text-white rounded-lg border border-primary/30 min-w-[150px]">
                      <div className="flex items-center justify-between mb-2">
                         <span className="text-[10px] font-black text-primary uppercase tracking-widest">{v.id}</span>
                         <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      </div>
                      <p className="font-bold text-sm tracking-tight">{v.name}</p>
                      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/10">
                         <div>
                            <p className="text-[8px] text-muted-foreground uppercase font-bold">Velocity</p>
                            <p className="text-xs font-mono font-bold text-success">{v.speed} MPH</p>
                         </div>
                         <div>
                            <p className="text-[8px] text-muted-foreground uppercase font-bold">Heading</p>
                            <p className="text-xs font-mono font-bold">{v.heading}</p>
                         </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}

          {/* Map Status Overlays */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-[1000] pointer-events-none">
            <div className="glass-card px-4 py-2 flex items-center gap-3 bg-black/60 backdrop-blur-xl border-white/10">
               <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Live Encryption Active</span>
            </div>
            {perms.role === "driver" && (
              <div className="glass-card px-4 py-2 flex items-center gap-3 bg-primary/20 backdrop-blur-xl border-primary/30">
                 <Target className="w-4 h-4 text-primary animate-spin-slow" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Focused on Asset VH-001</span>
              </div>
            )}
          </div>

          {/* Telemetry HUD (Bottom Left) */}
          <div className="absolute bottom-6 left-6 z-[1000] hidden md:block">
             <div className="glass-card p-4 bg-black/40 backdrop-blur-xl border-white/10 flex gap-6">
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase font-black mb-1">Satellite Latency</p>
                  <p className="text-sm font-black font-mono text-success">24ms</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase font-black mb-1">GIS Protocol</p>
                  <p className="text-sm font-black font-mono text-primary uppercase">OSM-DARK v4.2</p>
                </div>
             </div>
          </div>
        </div>

        {/* Vehicle list sidebar */}
        <div className="space-y-4 max-h-[650px] overflow-y-auto pr-2 custom-scrollbar">
          <div className="flex items-center justify-between pl-1">
             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{perms.role === "driver" ? "Unit Status" : "Fleet Terminal"}</p>
             <button className="text-primary hover:text-primary/80 transition-colors">
                <Compass className="w-4 h-4" />
             </button>
          </div>
          <AnimatePresence mode="popLayout">
            {displayVehicles.map((v, i) => (
              <motion.div 
                key={v.id} 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }} 
                className={`glass-card p-5 group transition-all duration-300 cursor-pointer relative overflow-hidden ${perms.role === "driver" ? "border-l-4 border-l-primary bg-primary/5" : "hover:border-primary/40 shadow-xl"}`}
              >
                <div className="flex items-center justify-between mb-2 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_theme(colors.success.DEFAULT)]" />
                    <span className="text-sm font-black tracking-tight text-foreground group-hover:text-primary transition-colors">{v.id}</span>
                  </div>
                  <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-tighter text-muted-foreground italic">
                    Vector {v.heading}
                  </div>
                </div>
                <p className="text-xs font-bold text-muted-foreground/80 mb-4 tracking-tight">{v.name}</p>
                
                <div className="grid grid-cols-2 gap-4 mt-2 pt-4 border-t border-white/5 relative z-10">
                  <div>
                    <p className="text-[8px] uppercase font-black text-muted-foreground tracking-widest mb-1.5 opacity-60">Velocity</p>
                    <div className="flex items-baseline gap-1">
                       <span className="text-lg font-black font-mono text-primary tracking-tighter">{v.speed}</span>
                       <span className="text-[8px] font-black text-muted-foreground">MPH</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[8px] uppercase font-black text-muted-foreground tracking-widest mb-1.5 opacity-60">Operator</p>
                    <p className="text-xs font-black truncate text-foreground">{v.driver}</p>
                  </div>
                </div>
                
                {/* Driver-specific indicators */}
                {perms.role === "driver" && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                     <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black uppercase tracking-widest text-success">Sync Active</span>
                        <MapIcon className="w-3.5 h-3.5 text-primary opacity-40" />
                     </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MapPage;
