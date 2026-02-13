import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import PageTransition from "@/components/PageTransition";
import { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-[240px] transition-all duration-300">
        <DashboardHeader />
        <main className="p-6 space-y-6">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
