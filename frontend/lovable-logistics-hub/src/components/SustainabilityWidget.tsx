import { motion } from "framer-motion";
import { Leaf, TrendingDown } from "lucide-react";

const SustainabilityWidget = () => {
  const co2Saved = 12.4;
  const greenRoutes = 67;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="glass-card p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg kpi-gradient-green flex items-center justify-center">
          <Leaf className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Carbon Impact</h3>
          <p className="text-xs text-muted-foreground">Monthly sustainability report</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">CO₂ Reduced</span>
            <span className="text-xs font-mono text-success flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              {co2Saved} tons
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-secondary">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "72%" }}
              transition={{ duration: 1, delay: 1 }}
              className="h-full rounded-full kpi-gradient-green"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Green Routes Used</span>
            <span className="text-xs font-mono text-success">{greenRoutes}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-secondary">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${greenRoutes}%` }}
              transition={{ duration: 1, delay: 1.1 }}
              className="h-full rounded-full kpi-gradient-blue"
            />
          </div>
        </div>

        <div className="p-3 rounded-lg bg-success/5 border border-success/10">
          <p className="text-xs text-success">
            🌿 Fleet emissions down <span className="font-mono font-bold">18%</span> vs last quarter
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SustainabilityWidget;
