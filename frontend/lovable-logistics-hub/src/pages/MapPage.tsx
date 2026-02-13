import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Truck, Navigation, Layers, ZoomIn, ZoomOut, AlertTriangle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { MapSkeleton, MapVehicleListSkeleton } from "@/components/DashboardSkeletons";

const vehicles = [
  { id: "VH-001", name: "Freightliner Cascadia", driver: "M. Rodriguez", position: { lat: 35.08, lng: -106.65 }, speed: 62, status: "active", heading: "E" },
  { id: "VH-002", name: "Kenworth T680", driver: "K. Johnson", position: { lat: 29.76, lng: -95.37 }, speed: 58, status: "active", heading: "SE" },
  { id: "VH-005", name: "Mack Anthem", driver: "J. Williams", position: { lat: 32.08, lng: -81.09 }, speed: 55, status: "active", heading: "S" },
  { id: "VH-006", name: "International LT", driver: "D. Martinez", position: { lat: 41.88, lng: -87.63 }, speed: 61, status: "active", heading: "SW" },
  { id: "VH-008", name: "DAF XF", driver: "S. Patel", position: { lat: 33.45, lng: -112.07 }, speed: 65, status: "active", heading: "N" },
];

const MAP_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const MapPage = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1200); return () => clearTimeout(t); }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div>
          <h2 className="text-xl font-bold text-foreground">Live Map</h2>
          <p className="text-sm text-muted-foreground">{vehicles.length} vehicles currently tracked</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3"><MapSkeleton /></div>
          <MapVehicleListSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Live Fleet Map</h2>
          <p className="text-sm text-muted-foreground">{vehicles.length} vehicles currently in transit</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground text-xs font-medium transition-colors flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Traffic Layers
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5" /> Optimize All Routes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="lg:col-span-3 glass-card relative overflow-hidden bg-muted/20" 
          style={{ minHeight: 600 }}
        >
          {MAP_API_KEY ? (
            <APIProvider apiKey={MAP_API_KEY}>
              <Map
                style={{ width: '100%', height: '100%' }}
                defaultCenter={{ lat: 37.0902, lng: -95.7129 }}
                defaultZoom={4}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                mapId={'NEXUS_LOGISTICS_DARK'}
              >
                {vehicles.map((v) => (
                  <Marker 
                    key={v.id} 
                    position={v.position}
                    title={`${v.name} - ${v.driver}`}
                  />
                ))}
              </Map>
            </APIProvider>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-slate-950/50 backdrop-blur-sm">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4 border border-amber-500/20">
                <AlertTriangle className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Google Maps Key Required</h3>
              <p className="max-w-md text-sm text-muted-foreground mb-6">
                To enable the Live GIS tracking environment, please add your Google Maps API Key to the <code>.env</code> file.
              </p>
              <div className="p-4 bg-muted/50 rounded-lg border border-border w-full max-w-sm text-left font-mono text-[10px]">
                VITE_GOOGLE_MAPS_API_KEY=your_key_here
              </div>
            </div>
          )}

          {/* Map Status Overlays */}
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="glass-card px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-success/10 text-success border-success/20">
              System Live
            </div>
            <div className="glass-card px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border-primary/20">
              GPS Sync Active
            </div>
          </div>
        </motion.div>

        {/* Vehicle list sidebar */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Live Telemetry</p>
          {vehicles.map((v, i) => (
            <motion.div 
              key={v.id} 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.1 + i * 0.05 }} 
              whileHover={{ scale: 1.02, x: -4 }} 
              className="glass-card p-4 hover:border-primary/40 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{v.id}</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded italic">
                  MOVING {v.heading}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{v.name}</p>
              
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border/50">
                <div>
                  <p className="text-[9px] uppercase font-bold text-muted-foreground/60">Speed</p>
                  <p className="text-sm font-mono text-primary font-bold">{v.speed} MPH</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase font-bold text-muted-foreground/60">Driver</p>
                  <p className="text-sm font-medium">{v.driver}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MapPage;
