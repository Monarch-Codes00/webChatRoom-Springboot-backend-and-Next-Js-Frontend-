import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Truck,
  Box,
  Package,
  Map,
  BarChart3,
  Fuel,
  UserCircle,
  Leaf,
  Shield,
  Settings,
  ChevronRight,
  ChevronLeft,
  LogOut
} from "lucide-react";

import { usePermissions } from "@/hooks/usePermissions";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/", key: 'canAccessShipments' },
  { icon: Truck, label: "Fleet", path: "/fleet", key: 'canAccessFleet' },
  { icon: Box, label: "Warehouse", path: "/warehouse", key: 'canAccessWarehouse' },
  { icon: Package, label: "Shipments", path: "/shipments", key: 'canAccessShipments' },
  { icon: Map, label: "Live Map", path: "/map", key: 'canAccessLiveMap' },
  { icon: BarChart3, label: "Analytics", path: "/analytics", key: 'canAccessAnalytics' },
  { icon: Fuel, label: "Telematics", path: "/telematics", key: 'canAccessTelematics' },
  { icon: UserCircle, label: "Driver Portal", path: "/driver", key: 'canAccessDriverPortal' },
  { icon: Leaf, label: "Sustainability", path: "/sustainability", key: 'canAccessSustainability' },
  { icon: Shield, label: "Compliance", path: "/compliance", key: 'canAccessCompliance' },
  { icon: Settings, label: "Settings", path: "/settings", key: 'canAccessSettings' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const perms = usePermissions();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const accessibleItems = navItems.filter(item => perms[item.key as keyof typeof perms]);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col z-50"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border focus:outline-none">
        <div className="w-8 h-8 rounded-lg kpi-gradient-blue flex items-center justify-center shrink-0">
          <Package className="w-4 h-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-hidden"
          >
            <span className="font-extrabold text-foreground text-[13px] tracking-[0.06em]">
              NEXUS
            </span>
            <span className="font-medium text-primary text-[13px] tracking-[0.06em]">LOGISTICS</span>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-thin">
        {accessibleItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group relative ${
                isActive
                   ? "bg-primary/10 text-primary glow-border"
                   : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-0.5"
               }`}
            >
              <item.icon
                className={`w-[18px] h-[18px] shrink-0 ${
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                }`}
                strokeWidth={isActive ? 2.25 : 1.75}
              />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="truncate text-[13px] font-medium"
                >
                  {item.label}
                </motion.span>
              )}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Section / Auth */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
              <UserCircle className="w-5 h-5 text-primary" />
            </div>
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-bold text-foreground truncate">{user?.username || "Guest"}</span>
                <span className="text-[10px] text-muted-foreground truncate uppercase tracking-widest font-bold">
                  {user?.role || "GUEST"}
                </span>
              </div>
            )}
          </div>
          {!collapsed && (
             <button 
               onClick={logout}
               className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
               title="Sign Out"
             >
               <LogOut className="w-4 h-4" />
             </button>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-sidebar-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
