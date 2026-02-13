import { motion } from "framer-motion";
import { Truck, Fuel, Thermometer, Gauge } from "lucide-react";

const vehicles = [
  {
    id: "VH-001",
    name: "Freightliner Cascadia",
    status: "active" as const,
    fuel: 78,
    speed: 62,
    temp: 4.2,
    driver: "M. Rodriguez",
    location: "I-40, New Mexico",
  },
  {
    id: "VH-002",
    name: "Kenworth T680",
    status: "active" as const,
    fuel: 45,
    speed: 58,
    temp: -18.5,
    driver: "K. Johnson",
    location: "I-10, Texas",
  },
  {
    id: "VH-003",
    name: "Volvo VNL 860",
    status: "warning" as const,
    fuel: 22,
    speed: 0,
    temp: 2.1,
    driver: "A. Chen",
    location: "Denver Hub",
  },
  {
    id: "VH-004",
    name: "Peterbilt 579",
    status: "danger" as const,
    fuel: 91,
    speed: 0,
    temp: null,
    driver: "R. Smith",
    location: "Maintenance Bay",
  },
];

const VehicleStatus = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Fleet Status</h3>
          <p className="text-xs text-muted-foreground">Real-time vehicle telemetry</p>
        </div>
        <span className="text-xs font-mono text-primary">
          {vehicles.filter((v) => v.status === "active").length}/{vehicles.length} Active
        </span>
      </div>

      <div className="space-y-3">
        {vehicles.map((v) => (
          <div
            key={v.id}
            className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/20 hover:bg-secondary/50 transition-all duration-200 cursor-pointer hover:-translate-y-px"
          >
            <div className="relative w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
              <Truck className="w-4 h-4 text-muted-foreground" strokeWidth={1.75} />
              <span className={`absolute -top-0.5 -right-0.5 status-dot status-${v.status}`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground truncate">{v.name}</p>
                <span className="text-xs font-mono text-muted-foreground">{v.id}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{v.location}</p>
                <div className="flex items-center gap-4 mt-1.5">
                <div className="flex items-center gap-1 text-[11px]">
                  <Fuel className="w-3 h-3 text-primary" strokeWidth={1.75} />
                  <span className={`font-mono ${v.fuel < 30 ? "text-warning" : "text-muted-foreground"}`}>
                    {v.fuel}%
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px]">
                  <Gauge className="w-3 h-3 text-primary" strokeWidth={1.75} />
                  <span className="font-mono text-muted-foreground">{v.speed} mph</span>
                </div>
                {v.temp !== null && (
                  <div className="flex items-center gap-1 text-[11px]">
                    <Thermometer className="w-3 h-3 text-primary" strokeWidth={1.75} />
                    <span className="font-mono text-muted-foreground">{v.temp}°C</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default VehicleStatus;
