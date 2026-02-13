import { motion } from "framer-motion";
import { Truck, MapPin, Package, CheckCircle2, Navigation, ClipboardList, Camera } from "lucide-react";
import { useState } from "react";

const DriverDashboard = () => {
  const [activeStep, setActiveStep] = useState(0);

  const shipment = {
    id: "SHP-10293",
    destination: "123 Logistics St, San Francisco, CA",
    recipient: "Acme Corp Warehouse",
    status: "in-transit",
    items: "12x Industrial Pallets",
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24 md:p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Driver Portal</h1>
          <p className="text-muted-foreground text-sm">Vehicle: VH-001 (Freightliner)</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Truck className="w-6 h-6 text-primary" />
        </div>
      </div>

      {/* Primary Action Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card p-6 flex flex-col gap-4 border-l-4 border-l-primary"
      >
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Current Mission</span>
            <h2 className="text-xl font-bold mt-1">{shipment.id}</h2>
          </div>
          <div className="px-2 py-1 rounded bg-success/10 text-success text-[10px] font-bold">
            ON TIME
          </div>
        </div>

        <div className="space-y-3 mt-2">
          <div className="flex gap-3">
            <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Destination</p>
              <p className="text-sm font-medium">{shipment.destination}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Package className="w-5 h-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Cargo Details</p>
              <p className="text-sm font-medium">{shipment.items}</p>
            </div>
          </div>
        </div>

        <button className="w-full mt-4 py-4 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all">
          <Navigation className="w-5 h-5" />
          START NAVIGATION
        </button>
      </motion.div>

      {/* Proof of Delivery Section (Smart Feature) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Proof of Delivery</h3>
          {activeStep === 2 && <span className="text-[10px] bg-success/20 text-success px-2 py-0.5 rounded-full font-bold">READY TO SYNC</span>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setActiveStep(prev => prev === 0 ? 1 : prev)}
            className={`glass-card p-4 flex flex-col items-center gap-2 border-dashed border-2 transition-all ${activeStep >= 1 ? 'border-success/50 bg-success/5' : 'hover:border-primary/50'}`}
          >
            {activeStep >= 1 ? <CheckCircle2 className="w-6 h-6 text-success" /> : <Camera className="w-6 h-6 text-muted-foreground" />}
            <span className="text-xs font-medium">{activeStep >= 1 ? "Photo Captured" : "Take Photo"}</span>
          </button>
          <button 
            onClick={() => setActiveStep(prev => prev === 1 ? 2 : prev)}
            className={`glass-card p-4 flex flex-col items-center gap-2 border-dashed border-2 transition-all ${activeStep >= 2 ? 'border-success/50 bg-success/5' : 'hover:border-primary/50'}`}
          >
            {activeStep >= 2 ? <CheckCircle2 className="w-6 h-6 text-success" /> : <ClipboardList className="w-6 h-6 text-muted-foreground" />}
            <span className="text-xs font-medium">{activeStep >= 2 ? "Signature Logged" : "Log Signature"}</span>
          </button>
        </div>
        
        <motion.button 
          whileTap={{ scale: 0.95 }}
          disabled={activeStep < 2}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 transition-all font-bold ${activeStep >= 2 ? 'bg-success text-success-foreground shadow-lg' : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'}`}
        >
          <CheckCircle2 className="w-5 h-5" />
          {activeStep >= 2 ? "SUBMIT SHIPMENT AS DELIVERED" : "COMPLETE TASKS ABOVE"}
        </motion.button>
      </div>

      {/* Bottom Nav (Mobile Only) */}
      <div className="fixed bottom-6 left-4 right-4 h-16 glass-card px-8 flex items-center justify-between z-50 rounded-2xl shadow-2xl lg:hidden">
        <Truck className="w-6 h-6 text-primary" />
        <Navigation className="w-6 h-6 text-muted-foreground" />
        <CheckCircle2 className="w-6 h-6 text-muted-foreground" />
      </div>
    </div>
  );
};

export default DriverDashboard;
