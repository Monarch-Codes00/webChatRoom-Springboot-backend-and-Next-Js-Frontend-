import { motion } from "framer-motion";
import { Truck, MapPin, Package, CheckCircle2, Navigation, ClipboardList, Camera, AlertTriangle, ShieldAlert, Activity, FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DriverDashboard = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isReportingIncident, setIsReportingIncident] = useState(false);

  const handleIncidentReport = () => {
    setIsReportingIncident(true);
    // Simulate API call
    setTimeout(() => {
      setIsReportingIncident(false);
      toast.error("INCIDENT REPORTED", {
        description: "Emergency dispatch and your supervisor have been notified. Stay with the vehicle.",
        duration: 10000,
      });
    }, 1500);
  };

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
          <h1 className="text-2xl font-bold tracking-tight">Driver Portal</h1>
          <p className="text-muted-foreground text-sm">Vehicle: <span className="text-foreground font-mono font-bold">VH-001</span></p>
        </div>
        <div className="flex gap-3">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleIncidentReport}
            className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all shadow-lg ${isReportingIncident ? 'bg-destructive animate-pulse' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}
          >
            <ShieldAlert className="w-6 h-6" />
          </motion.button>
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg">
            <Truck className="w-6 h-6 text-primary" />
          </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* OBD-II Health Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5 bg-slate-900/50"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-success" />
            <h3 className="text-sm font-bold text-foreground">OBD-II Live Health</h3>
          </div>
          <div className="space-y-4">
            {[
              { label: "Engine Temp", value: "92°C", color: "bg-success", level: 60 },
              { label: "Oil Pressure", value: "45 PSI", color: "bg-primary", level: 45 },
              { label: "Battery", value: "14.2V", color: "bg-success", level: 85 },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-muted-foreground">{stat.label}</span>
                  <span className="font-bold text-foreground font-mono">{stat.value}</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${stat.level}%` }} 
                    className={`h-full ${stat.color}`} 
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Digital Waybill Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5 border-l-4 border-l-primary"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Digital Waybill</h3>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-muted/20 rounded">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">WB Number</span>
              <span className="text-xs font-mono font-bold">WB-8829-NX</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-muted/20 rounded text-center">
                <p className="text-[8px] text-muted-foreground uppercase font-bold">Weight</p>
                <p className="text-xs font-bold">14.5T</p>
              </div>
              <div className="p-2 bg-muted/20 rounded text-center">
                <p className="text-[8px] text-muted-foreground uppercase font-bold">Type</p>
                <p className="text-xs font-bold">Medical</p>
              </div>
            </div>
            <button className="w-full py-2 text-[10px] text-primary hover:bg-primary/5 rounded border border-primary/20 font-bold uppercase tracking-wider">
              Download PDF Manifest
            </button>
          </div>
        </motion.div>
      </div>

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
