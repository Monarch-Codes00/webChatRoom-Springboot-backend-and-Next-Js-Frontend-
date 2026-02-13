import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  gradient: "blue" | "green" | "amber" | "red";
  delay?: number;
}

const gradientMap = {
  blue: "kpi-gradient-blue",
  green: "kpi-gradient-green",
  amber: "kpi-gradient-amber",
  red: "kpi-gradient-red",
};

const KpiCard = ({ title, value, change, changeType, icon: Icon, gradient, delay = 0 }: KpiCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-5 relative overflow-hidden group hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_hsl(195_100%_50%/0.08)]"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">
            {title}
          </p>
          <p className="text-[28px] font-extrabold text-foreground tracking-tight leading-none">{value}</p>
          <p
            className={`text-[11px] font-medium ${
              changeType === "positive"
                ? "text-success"
                : changeType === "negative"
                ? "text-destructive"
                : "text-muted-foreground"
            }`}
          >
            {change}
          </p>
        </div>
        <div className={`w-11 h-11 rounded-xl ${gradientMap[gradient]} flex items-center justify-center shadow-lg`}>
          <Icon className="w-[18px] h-[18px] text-primary-foreground" strokeWidth={2.25} />
        </div>
      </div>

      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full ${gradientMap[gradient]} opacity-10 blur-2xl`} />
      </div>
    </motion.div>
  );
};

export default KpiCard;
