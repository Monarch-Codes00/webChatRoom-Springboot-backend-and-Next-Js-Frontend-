import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, FileText, AlertTriangle, CheckCircle, Clock, Calendar, Upload, Download } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { KpiCardSkeleton, DocumentListSkeleton, TableSkeleton } from "@/components/DashboardSkeletons";

const documents = [
  { name: "CDL — M. Rodriguez", type: "Driver License", expiry: "Aug 15, 2026", status: "valid" },
  { name: "CDL — K. Johnson", type: "Driver License", expiry: "Mar 02, 2026", status: "expiring" },
  { name: "Vehicle Permit — VH-001", type: "Permit", expiry: "Dec 31, 2026", status: "valid" },
  { name: "Insurance — VH-004", type: "Insurance", expiry: "Feb 28, 2026", status: "expired" },
  { name: "CDL — A. Chen", type: "Driver License", expiry: "Nov 10, 2026", status: "valid" },
  { name: "Hazmat Cert — VH-002", type: "Certification", expiry: "Jul 01, 2026", status: "valid" },
  { name: "Vehicle Permit — VH-007", type: "Permit", expiry: "Feb 20, 2026", status: "expired" },
  { name: "Insurance — VH-006", type: "Insurance", expiry: "Jun 15, 2026", status: "valid" },
];

const statusConfig: Record<string, { label: string; class: string; icon: any }> = {
  valid: { label: "Valid", class: "text-success bg-success/10 border-success/20", icon: CheckCircle },
  expiring: { label: "Expiring Soon", class: "text-warning bg-warning/10 border-warning/20", icon: Clock },
  expired: { label: "Expired", class: "text-destructive bg-destructive/10 border-destructive/20", icon: AlertTriangle },
};

const inspections = [
  { vehicle: "VH-001", date: "Feb 10, 2026", type: "Pre-trip DVIR", result: "Pass", issues: 0 },
  { vehicle: "VH-002", date: "Feb 10, 2026", type: "Pre-trip DVIR", result: "Pass", issues: 1 },
  { vehicle: "VH-004", date: "Feb 09, 2026", type: "DOT Inspection", result: "Fail", issues: 3 },
  { vehicle: "VH-005", date: "Feb 10, 2026", type: "Pre-trip DVIR", result: "Pass", issues: 0 },
  { vehicle: "VH-006", date: "Feb 10, 2026", type: "Pre-trip DVIR", result: "Pass", issues: 0 },
];

const CompliancePage = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1200); return () => clearTimeout(t); }, []);

  const valid = documents.filter((d) => d.status === "valid").length;
  const expiring = documents.filter((d) => d.status === "expiring").length;
  const expired = documents.filter((d) => d.status === "expired").length;

  if (loading) {
    return (
      <DashboardLayout>
        <div>
          <h2 className="text-xl font-bold text-foreground">Compliance & Documents</h2>
          <p className="text-sm text-muted-foreground">Document vault and regulatory compliance</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <KpiCardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DocumentListSkeleton />
          <TableSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Compliance & Documents</h2>
          <p className="text-sm text-muted-foreground">Document vault and regulatory compliance</p>
        </div>
        <button className="px-4 py-2 rounded-lg kpi-gradient-blue text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
          <Upload className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Valid", value: valid, gradient: "kpi-gradient-green", icon: CheckCircle },
          { label: "Expiring Soon", value: expiring, gradient: "kpi-gradient-amber", icon: Clock },
          { label: "Expired", value: expired, gradient: "kpi-gradient-red", icon: AlertTriangle },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${s.gradient} flex items-center justify-center`}>
              <s.icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Documents */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Document Vault</h3>
            </div>
          </div>
          <div className="divide-y divide-border/50">
            {documents.map((d) => {
              const st = statusConfig[d.status];
              return (
                <div key={d.name} className="flex items-center justify-between px-5 py-3 hover:bg-secondary/30 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">{d.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>{d.type}</span>
                      <span>·</span>
                      <Calendar className="w-3 h-3" />
                      <span>Exp: {d.expiry}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${st.class}`}>
                      <st.icon className="w-3 h-3" />
                      {st.label}
                    </span>
                    <button className="p-1 hover:bg-secondary rounded transition-colors">
                      <Download className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Inspections */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Recent Inspections</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["Vehicle", "Date", "Type", "Result", "Issues"].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inspections.map((insp, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3 text-sm font-mono text-foreground">{insp.vehicle}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{insp.date}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{insp.type}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium ${insp.result === "Pass" ? "text-success" : "text-destructive"}`}>{insp.result}</span>
                    </td>
                    <td className="px-5 py-3 text-sm font-mono text-muted-foreground">{insp.issues}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default CompliancePage;
