import { useState } from "react";
import { motion } from "framer-motion";
import { Truck, Shield, Zap, ArrowRight, Globe, BarChart3, Clock } from "lucide-react";
import AuthModal from "@/components/AuthModal";

const LandingPage = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const openAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30 selection:text-primary overflow-x-hidden">
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialMode={authMode} />
      
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_theme(colors.primary.DEFAULT)]">
            <Truck className="text-black w-6 h-6" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">Nexus<span className="text-primary not-italic">Logistics</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          <a href="#features" className="hover:text-primary transition-colors">Infrastructure</a>
          <a href="#solutions" className="hover:text-primary transition-colors">Global Network</a>
          <a href="#security" className="hover:text-primary transition-colors">Security</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => openAuth("login")}
            className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
          >
            Operator Log In
          </button>
          <button 
            onClick={() => openAuth("register")}
            className="px-6 py-2.5 rounded-xl bg-primary text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]"
          >
            Register Fleet
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 pt-20 pb-32 px-6 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            <Zap className="w-3 h-3 fill-current" /> Next-Gen Autonomous Logistics
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
            QUANTUM <span className="text-primary italic">COMMAND</span> <br />
            FOR MODERN FLEETS
          </h1>
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            The definitive operating system for global logistics. Real-time telematics, AI-driven routing, and total asset oversight in a single high-performance interface.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => openAuth("register")}
              className="group px-8 py-5 rounded-2xl bg-primary text-black text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(34,197,94,0.4)] flex items-center gap-3"
            >
              Initialize Headquarters <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => openAuth("login")}
              className="px-8 py-5 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-md"
            >
              Enter Terminal
            </button>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-40">
          {[
            {
              icon: Globe,
              title: "Global Mesh Network",
              desc: "Coordinate assets across 40+ countries with sub-second latency and zero signal dropout."
            },
            {
              icon: BarChart3,
              title: "Predictive Analytics",
              desc: "AI engines forecast fuel consumption and maintenance cycles with 98.4% surgical precision."
            },
            {
              icon: Shield,
              title: "Hardened Security",
              desc: "Military-grade encryption for mission-critical cargo and sensitive shipment manifests."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 text-left hover:border-primary/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-black transition-all">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black tracking-tight mb-4 uppercase italic">0{i+1} — {feature.title}</h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-40 border-t border-white/10 pt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: "Active Assets", value: "24.8K" },
              { label: "Data Points/Min", value: "8.2M" },
              { label: "Uptime SLA", value: "99.99%" },
              { label: "Fuel Saved", value: "1.4M L" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl font-black text-primary mb-2 font-mono">{stat.value}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3 opacity-50">
            <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
              <Truck className="text-black w-4 h-4" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-black tracking-tighter uppercase italic">Nexus<span className="not-italic opacity-70">Logistics</span></span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            © 2026 Nexus Logistics Infrastructure Group. All rights reserved.
          </p>
          <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">SLA</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
