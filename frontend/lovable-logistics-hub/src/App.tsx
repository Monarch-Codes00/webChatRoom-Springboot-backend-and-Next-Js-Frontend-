import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/clerk-react";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Get the publishable key from environmental variables
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  console.warn("Missing Clerk Publishable Key - Using local dev mode (Auth disabled)");
}

const RoleProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { user, isLoaded } = useUser();
  
  if (!isLoaded) return <div className="h-screen w-screen flex items-center justify-center bg-background"><div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const role = (user?.publicMetadata?.role as string) || "admin";
  
  if (!allowedRoles.includes(role)) {
    // Redirect to their default page
    const fallback = role === "driver" ? "/driver" : "/";
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public or Common Routes */}
        <Route path="/" element={<RoleProtectedRoute allowedRoles={["admin", "warehouse"]}><Index /></RoleProtectedRoute>} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Admin Only */}
        <Route path="/fleet" element={<RoleProtectedRoute allowedRoles={["admin"]}><FleetPage /></RoleProtectedRoute>} />
        <Route path="/analytics" element={<RoleProtectedRoute allowedRoles={["admin"]}><AnalyticsPage /></RoleProtectedRoute>} />
        <Route path="/telematics" element={<RoleProtectedRoute allowedRoles={["admin"]}><TelematicsPage /></RoleProtectedRoute>} />
        <Route path="/sustainability" element={<RoleProtectedRoute allowedRoles={["admin"]}><SustainabilityPage /></RoleProtectedRoute>} />
        <Route path="/compliance" element={<RoleProtectedRoute allowedRoles={["admin"]}><CompliancePage /></RoleProtectedRoute>} />

        {/* Warehouse & Admin */}
        <Route path="/warehouse" element={<RoleProtectedRoute allowedRoles={["admin", "warehouse"]}><WarehousePage /></RoleProtectedRoute>} />
        <Route path="/shipments" element={<RoleProtectedRoute allowedRoles={["admin", "warehouse"]}><ShipmentsPage /></RoleProtectedRoute>} />

        {/* Driver Only */}
        <Route path="/driver" element={<RoleProtectedRoute allowedRoles={["admin", "driver"]}><DriverDashboard /></RoleProtectedRoute>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const content = (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );

  if (!CLERK_PUBLISHABLE_KEY || CLERK_PUBLISHABLE_KEY === "pk_test_placeholder") {
    return content;
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      {content}
    </ClerkProvider>
  );
};

export default App;
