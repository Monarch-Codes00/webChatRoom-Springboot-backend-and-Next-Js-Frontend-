import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Truck, Navigation, Layers } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { MapSkeleton, MapVehicleListSkeleton } from "@/components/DashboardSkeletons";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default Leaflet marker icons in Vite
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/apiService";

const MapPage = () => {
  const [mounted, setMounted] = useState(false);
  const { data: vehiclesData, isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const resp = await apiService.getVehicles();
      return resp.data;
    },
    initialData: [],
  });

  const vehicles = Array.isArray(vehiclesData) ? vehiclesData : [];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoading) {
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
          <h2 className="text-xl font-bold text-foreground">Live Fleet Map (OpenStreetMap)</h2>
          <p className="text-sm text-muted-foreground">{vehicles.length} vehicles currently in transit</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground text-xs font-medium transition-colors flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Satellite View
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5" /> Optimize All Routes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map Area */}
        <div className="lg:col-span-3 glass-card relative overflow-hidden bg-muted/20 border-border/50" style={{ height: 600 }}>
          {mounted && (
            <MapContainer 
              center={[37.0902, -95.7129]} 
              zoom={4} 
              scrollWheelZoom={true} 
              className="w-full h-full z-10"
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <ZoomControl position="bottomright" />
              {vehicles.map((v) => (
                <Marker key={v.id} position={v.position as [number, number]}>
                  <Popup>
                    <div className="p-2">
                      <p className="font-bold text-primary">{v.id}</p>
                      <p className="text-xs">{v.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Driver: {v.driver}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}

          {/* Map Status Overlays */}
          <div className="absolute top-4 left-4 flex gap-2 z-[1000]">
            <div className="glass-card px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-success/10 text-success border-success/20 backdrop-blur-md">
              System Live
            </div>
            <div className="glass-card px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border-primary/20 backdrop-blur-md">
              OpenStreetMap Active
            </div>
          </div>
        </div>

        {/* Vehicle list sidebar */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Live Telemetry</p>
          {vehicles.map((v, i) => (
            <motion.div 
              key={v.id} 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.1 + i * 0.05 }} 
              className="glass-card p-4 hover:border-primary/40 transition-all duration-200 cursor-pointer group shadow-sm bg-card/30"
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
