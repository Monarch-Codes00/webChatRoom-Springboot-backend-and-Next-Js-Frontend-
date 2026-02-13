import { motion } from "framer-motion";
import { Package, MapPin, Clock, ArrowRight } from "lucide-react";

const shipments = [
  {
    id: "SHP-7842",
    origin: "Los Angeles, CA",
    destination: "Chicago, IL",
    status: "In Transit",
    statusType: "active" as const,
    eta: "2h 15m",
    driver: "M. Rodriguez",
    weight: "2,400 kg",
  },
  {
    id: "SHP-7843",
    origin: "Houston, TX",
    destination: "Miami, FL",
    status: "Loading",
    statusType: "warning" as const,
    eta: "5h 30m",
    driver: "K. Johnson",
    weight: "1,800 kg",
  },
  {
    id: "SHP-7844",
    origin: "Seattle, WA",
    destination: "Denver, CO",
    status: "Delivered",
    statusType: "active" as const,
    eta: "Completed",
    driver: "A. Chen",
    weight: "3,100 kg",
  },
  {
    id: "SHP-7845",
    origin: "New York, NY",
    destination: "Atlanta, GA",
    status: "Delayed",
    statusType: "danger" as const,
    eta: "+1h 45m",
    driver: "R. Smith",
    weight: "950 kg",
  },
  {
    id: "SHP-7846",
    origin: "Phoenix, AZ",
    destination: "Dallas, TX",
    status: "In Transit",
    statusType: "active" as const,
    eta: "3h 50m",
    driver: "J. Williams",
    weight: "2,750 kg",
  },
];

const statusStyles = {
  active: "text-success bg-success/10 border-success/20",
  warning: "text-warning bg-warning/10 border-warning/20",
  danger: "text-destructive bg-destructive/10 border-destructive/20",
};

const ShipmentTable = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card overflow-hidden"
    >
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Recent Shipments</h3>
          <p className="text-xs text-muted-foreground">Live tracking overview</p>
        </div>
        <button className="text-xs text-primary hover:text-primary/80 transition-colors font-medium">
          View All →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                Shipment
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                Route
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                Status
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                ETA
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                Driver
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                Weight
              </th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((s, i) => (
              <tr
                key={s.id}
                className="border-b border-border/50 hover:bg-secondary/30 hover:shadow-[inset_2px_0_0_hsl(195_100%_50%)] transition-all duration-200 cursor-pointer"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 text-primary" strokeWidth={1.75} />
                    <span className="text-sm font-mono font-medium text-foreground">{s.id}</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" strokeWidth={1.75} />
                    <span>{s.origin}</span>
                    <ArrowRight className="w-3 h-3 text-primary" strokeWidth={1.75} />
                    <span>{s.destination}</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[s.statusType]}`}
                  >
                    <span className={`status-dot status-${s.statusType}`} />
                    {s.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" strokeWidth={1.75} />
                    <span className="font-mono">{s.eta}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm text-foreground">{s.driver}</td>
                <td className="px-5 py-3 text-sm font-mono text-muted-foreground">{s.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ShipmentTable;
