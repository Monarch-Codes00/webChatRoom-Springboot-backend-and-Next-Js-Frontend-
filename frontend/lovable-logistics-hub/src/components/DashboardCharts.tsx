import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const deliveryData: any[] = [];
const costData: any[] = [];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-card p-3 border border-border text-xs space-y-1">
      <p className="font-medium text-foreground">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: <span className="font-mono">{entry.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

export const DeliveryChart = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.3 }}
    className="glass-card p-5"
  >
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Delivery Performance</h3>
        <p className="text-xs text-muted-foreground">This week's delivery metrics</p>
      </div>
      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-muted-foreground">Delivered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-warning" />
          <span className="text-muted-foreground">Pending</span>
        </div>
      </div>
    </div>
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={deliveryData}>
        <defs>
          <linearGradient id="deliveredGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(195, 100%, 50%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(195, 100%, 50%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
        <XAxis dataKey="name" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="delivered" stroke="hsl(195, 100%, 50%)" fill="url(#deliveredGrad)" strokeWidth={2} />
        <Area type="monotone" dataKey="pending" stroke="hsl(38, 92%, 50%)" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" />
      </AreaChart>
    </ResponsiveContainer>
  </motion.div>
);

export const CostChart = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.4 }}
    className="glass-card p-5"
  >
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Cost Breakdown</h3>
        <p className="text-xs text-muted-foreground">Monthly operational costs</p>
      </div>
      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-muted-foreground">Fuel</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-warning" />
          <span className="text-muted-foreground">Maintenance</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span className="text-muted-foreground">Labor</span>
        </div>
      </div>
    </div>
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={costData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
        <XAxis dataKey="name" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="fuel" fill="hsl(195, 100%, 50%)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="maintenance" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="labor" fill="hsl(142, 70%, 45%)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </motion.div>
);
