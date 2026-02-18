import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "./hooks/useAuth";
import Index from "./pages/Index";
import FleetPage from "./pages/Fleet";
import ShipmentsPage from "./pages/Shipments";
import MapPage from "./pages/MapPage";
import AnalyticsPage from "./pages/Analytics";
import TelematicsPage from "./pages/Telematics";
import SustainabilityPage from "./pages/Sustainability";
import CompliancePage from "./pages/Compliance";
import SettingsPage from "./pages/Settings";
import DriverDashboard from "./pages/DriverDashboard";
import WarehousePage from "@/pages/Warehouse";
import LandingPage from "./pages/Landing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const RoleProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { user, isLoaded, isSignedIn } = useAuth();
  
  if (!isLoaded) return <div className="h-screen w-screen flex items-center justify-center bg-black"><div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_15px_theme(colors.primary.DEFAULT)]" /></div>;

  if (!isSignedIn) return <Navigate to="/landing" replace />;

  const role = user?.role?.toLowerCase() || "admin";
  
  if (!allowedRoles.includes(role)) {
    const fallback = role === "driver" ? "/driver" : "/";
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase() || "admin";

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/landing" element={<LandingPage />} />
        
        <Route path="/" element={
           role === "driver" ? <Navigate to="/driver" replace /> : <Index />
        } />
        
        <Route path="/map" element={<MapPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Global Control (Admin Only) */}
        <Route path="/fleet" element={<RoleProtectedRoute allowedRoles={["admin"]}><FleetPage /></RoleProtectedRoute>} />
        <Route path="/analytics" element={<RoleProtectedRoute allowedRoles={["admin"]}><AnalyticsPage /></RoleProtectedRoute>} />
        <Route path="/telematics" element={<RoleProtectedRoute allowedRoles={["admin"]}><TelematicsPage /></RoleProtectedRoute>} />
        <Route path="/sustainability" element={<RoleProtectedRoute allowedRoles={["admin"]}><SustainabilityPage /></RoleProtectedRoute>} />
        <Route path="/compliance" element={<RoleProtectedRoute allowedRoles={["admin"]}><CompliancePage /></RoleProtectedRoute>} />

        {/* Operational Logistics (Warehouse & Admin) */}
        <Route path="/warehouse" element={<RoleProtectedRoute allowedRoles={["admin", "warehouse"]}><WarehousePage /></RoleProtectedRoute>} />
        <Route path="/shipments" element={<RoleProtectedRoute allowedRoles={["admin", "warehouse"]}><ShipmentsPage /></RoleProtectedRoute>} />

        {/* Tactical Field Support (Driver Only) */}
        <Route path="/driver" element={<RoleProtectedRoute allowedRoles={["admin", "driver"]}><DriverDashboard /></RoleProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {!isSignedIn ? (
            <Routes>
              <Route path="*" element={<LandingPage />} />
            </Routes>
          ) : (
            <AnimatedRoutes />
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
