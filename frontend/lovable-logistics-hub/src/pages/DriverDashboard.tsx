import { motion, AnimatePresence } from "framer-motion";
import { Truck, MapPin, Package, CheckCircle2, Navigation, ClipboardList, Camera, AlertTriangle, ShieldAlert, Activity, FileText, X, Trophy, Leaf } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/apiService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const DriverDashboard = () => {
  const queryClient = useQueryClient();
  const [activeStep, setActiveStep] = useState(0);
  const [isReportingIncident, setIsReportingIncident] = useState(false);
  const [isDVIRComplete, setIsDVIRComplete] = useState(false);
  const [showDVIR, setShowDVIR] = useState(false);
  const [dvirChecklist, setDvirChecklist] = useState({
    brakes: false,
    lights: false,
    tires: false,
    fluids: false,
    mirrors: false,
  });

  const { data: shipments, isLoading } = useQuery({
    queryKey: ["driver-tasks"],
    queryFn: async () => {
      const resp = await apiService.getShipments();
      return resp.data || [];
    }
  });

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const activeTask = shipments?.find((s: any) => s.id === selectedTaskId) || shipments?.[0] || {
    id: "—",
    destination: "No active mission",
    recipient: "—",
    status: "idle",
    items: "—",
  };

  useEffect(() => {
    if (!isDVIRComplete) {
      setTimeout(() => setShowDVIR(true), 1000);
    }
  }, [isDVIRComplete]);

  const handleIncidentReport = () => {
    setIsReportingIncident(true);
    setTimeout(() => {
      setIsReportingIncident(false);
      toast.error("INCIDENT REPORTED", {
        description: "Emergency dispatch and your supervisor have been notified. Stay with the vehicle.",
        duration: 10000,
      });
    }, 1500);
  };

  const handleDVIRSubmit = () => {
    setIsDVIRComplete(true);
    setShowDVIR(false);
    toast.success("DVIR SUBMITTED", {
      description: "Vehicle VH-001 is cleared for operation.",
    });
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center font-mono text-primary animate-pulse">SYNCING WITH TELEMATICS...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-24 md:p-8 flex flex-col gap-6">
      {/* DVIR Modal */}
      <Dialog open={showDVIR} onOpenChange={setShowDVIR}>
        <DialogContent className="glass-card border-border/50 max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              Pre-Trip Inspection (DVIR)
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Safety Checklist</p>
            {Object.keys(dvirChecklist).map((key) => (
              <div 
                key={key} 
                onClick={() => setDvirChecklist({...dvirChecklist, [key]: !dvirChecklist[key as keyof typeof dvirChecklist]})}
                className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
              >
                <span className="text-sm font-medium capitalize">{key}</span>
                <div className={`w-5 h-5 rounded border ${dvirChecklist[key as keyof typeof dvirChecklist] ? 'bg-primary border-primary flex items-center justify-center' : 'border-border'}`}>
                  {dvirChecklist[key as keyof typeof dvirChecklist] && <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <button 
              onClick={handleDVIRSubmit}
              disabled={!Object.values(dvirChecklist).every(v => v)}
              className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl disabled:opacity-50 transition-all shadow-lg glow-primary"
            >
              COMPLETE INSPECTION
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Driver Portal</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-2 h-2 rounded-full ${isDVIRComplete ? 'bg-success animate-pulse' : 'bg-destructive'}`} />
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {isDVIRComplete ? "Active Shift · VH-001" : "Pre-trip required"}
            </p>
          </div>
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

      {/* Manifest / Mission Selector */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Assigned Task Manifest</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {shipments?.map((s: any) => (
            <motion.div
              key={s.id}
              onClick={() => setSelectedTaskId(s.id)}
              whileTap={{ scale: 0.95 }}
              className={`min-w-[140px] p-3 rounded-xl border transition-all cursor-pointer ${selectedTaskId === s.id || (!selectedTaskId && shipments[0]?.id === s.id) ? 'bg-primary/20 border-primary shadow-[0_0_15px_-5px_theme(colors.primary.DEFAULT)]' : 'bg-secondary/20 border-border/50 opacity-60'}`}
            >
              <p className="text-[9px] font-bold text-muted-foreground">{s.id}</p>
              <p className="text-xs font-bold truncate mt-1">{s.destination}</p>
              <div className="flex items-center gap-1 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-success" />
                <span className="text-[8px] font-bold uppercase text-success">Verified</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Primary Action Card */}
      <motion.div 
        layoutId="mission-card"
        className="glass-card p-6 flex flex-col gap-4 border-l-4 border-l-primary relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-12 translate-x-12" />
        <div className="flex justify-between items-start relative z-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Current Mission</span>
            <h2 className="text-xl font-bold mt-1">{activeTask.id}</h2>
          </div>
          <div className="px-2 py-1 rounded bg-success/10 text-success text-[10px] font-bold flex items-center gap-1">
            <Activity className="w-3 h-3" /> ON TIME
          </div>
        </div>

        <div className="space-y-4 mt-2 relative z-10">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Destination</p>
              <p className="text-sm font-bold text-foreground">{activeTask.destination}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Package className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Cargo Load</p>
              <p className="text-sm font-bold text-foreground">{activeTask.items}</p>
            </div>
          </div>
        </div>

        <button 
          disabled={!isDVIRComplete}
          className={`w-full mt-4 py-4 bg-primary text-primary-foreground font-extrabold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20 ${!isDVIRComplete && 'opacity-50 cursor-not-allowed grayscale'}`}
        >
          <Navigation className="w-5 h-5" />
          START TRIP NAVIGATION
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* OBD-II Health Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card p-5 bg-slate-950/40 relative overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-success" />
            <h3 className="text-sm font-bold text-foreground uppercase tracking-tight">OBD-II Real-time Metrics</h3>
          </div>
          <div className="space-y-4">
            {[
              { label: "Engine Temp", value: "92°C", color: "bg-success", level: 60, unit: "NORMAL" },
              { label: "Brake Lining", value: "84%", color: "bg-primary", level: 84, unit: "HEALTHY" },
              { label: "Battery Optima", value: "14.2V", color: "bg-success", level: 85, unit: "POWERED" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="flex justify-between text-[10px] mb-1.5 font-bold">
                  <span className="text-muted-foreground uppercase tracking-tighter">{stat.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] text-success">{stat.unit}</span>
                    <span className="text-foreground font-mono">{stat.value}</span>
                  </div>
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${stat.level}%` }} 
                    className={`h-full ${stat.color} shadow-[0_0_8px_theme(colors.primary.DEFAULT)]`} 
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-4">
          <button className="glass-card p-4 flex flex-col items-center justify-center gap-2 hover:bg-primary/10 transition-colors border-l-4 border-l-amber-500">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-foreground">Defect Log</span>
          </button>
          <button className="glass-card p-4 flex flex-col items-center justify-center gap-2 hover:bg-primary/10 transition-colors border-l-4 border-l-blue-500">
            <FileText className="w-6 h-6 text-blue-500" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-foreground">Digital POD</span>
          </button>
        </div>
      </div>

      {/* Shift Performance Hub */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card p-5 border-l-4 border-l-success bg-success/5"
        >
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-black text-foreground uppercase tracking-tight">Shift Safety Score</h3>
             </div>
             <span className="text-xl font-black font-mono text-success">98</span>
          </div>
          <div className="space-y-4">
             <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-muted-foreground uppercase">Harsh Braking</span>
                <span className="text-success">0 EVENTS</span>
             </div>
             <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-muted-foreground uppercase">Speeding Zones</span>
                <span className="text-success">NO INFRACTIONS</span>
             </div>
             <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "98%" }} className="h-full bg-success" />
             </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card p-5 border-l-4 border-l-primary bg-primary/5"
        >
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-success" />
                <h3 className="text-sm font-black text-foreground uppercase tracking-tight">Eco-Driving</h3>
             </div>
             <div className="px-2 py-0.5 rounded bg-success/20 text-success text-[8px] font-black uppercase">Level 4</div>
          </div>
          <p className="text-[10px] text-muted-foreground font-medium mb-3">You've saved <span className="text-foreground font-bold">4.2L</span> of fuel today.</p>
          <div className="flex gap-2">
             {[1, 2, 3, 4].map(i => <div key={i} className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center text-success"><Leaf className="w-4 h-4" /></div>)}
             <div className="w-8 h-8 rounded-lg bg-muted/20 border border-dashed border-border flex items-center justify-center text-muted-foreground"><Trophy className="w-4 h-4 opacity-40" /></div>
          </div>
        </motion.div>
      </div>

      {/* Proof of Delivery Card (e-POD) */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card p-6 border-t-4 border-t-success bg-success/5"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold text-foreground">Electronic Proof of Delivery (e-POD)</h3>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Digital Audit Trail Required</p>
          </div>
          {activeStep === 2 && (
            <div className="h-8 w-8 rounded-full bg-success flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-success-foreground" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button 
            onClick={() => {
              if (!isDVIRComplete) return toast.error("Complete DVIR first");
              setActiveStep(prev => prev === 0 ? 1 : prev);
              toast.success("PHOTO CAPTURED", { description: "Timestamp and GPS tagged." });
            }}
            className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-dashed transition-all ${activeStep >= 1 ? 'border-success bg-success/10 text-success' : 'border-border/50 hover:border-primary/50 text-muted-foreground'}`}
          >
            <Camera className="w-8 h-8" />
            <span className="text-xs font-extrabold uppercase tracking-wide">Take Cargo Photo</span>
          </button>
          <button 
            onClick={() => {
              if (activeStep < 1) return toast.error("Take photo first");
              setActiveStep(prev => prev === 1 ? 2 : prev);
              toast.success("SIGNATURE CAPTURED", { description: "Encrypted and stored." });
            }}
            className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-dashed transition-all ${activeStep >= 2 ? 'border-success bg-success/10 text-success' : 'border-border/50 hover:border-primary/50 text-muted-foreground'}`}
          >
            <ClipboardList className="w-8 h-8" />
            <span className="text-xs font-extrabold uppercase tracking-wide">Client Signature</span>
          </button>
        </div>
        
        <button 
          disabled={activeStep < 2}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 transition-all font-extrabold tracking-widest ${activeStep >= 2 ? 'bg-success text-success-foreground shadow-[0_10px_30px_-10px_rgba(34,197,94,0.5)] scale-100 hover:scale-[1.02]' : 'bg-muted text-muted-foreground opacity-50'}`}
        >
          <CheckCircle2 className="w-6 h-6" />
          FINALIZE & SUBMIT DELIVERY
        </button>
      </motion.div>

      {/* Persistent Status Bar (Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-muted">
        <motion.div 
          initial={{ width: 0 }} 
          animate={{ width: isDVIRComplete ? "100%" : "30%" }} 
          className={`h-full ${isDVIRComplete ? 'bg-success shadow-[0_0_10px_theme(colors.success.DEFAULT)]' : 'bg-destructive'}`} 
        />
      </div>

      {/* Bottom Nav (Mobile Only) */}
      <div className="fixed bottom-6 left-4 right-4 h-16 glass-card px-8 flex items-center justify-between z-50 rounded-2xl shadow-2xl lg:hidden">
        <Truck className={`w-6 h-6 ${isDVIRComplete ? 'text-primary' : 'text-muted-foreground'}`} />
        <Navigation className="w-6 h-6 text-muted-foreground" />
        <CheckCircle2 className="w-6 h-6 text-muted-foreground" />
      </div>
    </div>
  );
};

export default DriverDashboard;
