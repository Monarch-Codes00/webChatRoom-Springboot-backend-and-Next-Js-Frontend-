import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
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
import WarehousePage from "./pages/Warehouse";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Get the publishable key from environmental variables
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  console.warn("Missing Clerk Publishable Key - Using local dev mode (Auth disabled)");
}

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/fleet" element={<FleetPage />} />
        <Route path="/shipments" element={<ShipmentsPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/telematics" element={<TelematicsPage />} />
        <Route path="/sustainability" element={<SustainabilityPage />} />
        <Route path="/compliance" element={<CompliancePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/driver" element={<DriverDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY || "pk_test_placeholder"}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;
