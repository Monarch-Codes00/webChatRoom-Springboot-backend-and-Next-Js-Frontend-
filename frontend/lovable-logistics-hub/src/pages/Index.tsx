import { useState, useEffect } from "react";
import { Package, Truck, Clock, DollarSign } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import KpiCard from "@/components/KpiCard";
import { DeliveryChart, CostChart } from "@/components/DashboardCharts";
import ShipmentTable from "@/components/ShipmentTable";
import VehicleStatus from "@/components/VehicleStatus";
import SustainabilityWidget from "@/components/SustainabilityWidget";
import {
  KpiCardSkeleton,
  ChartSkeleton,
  TableSkeleton,
  VehicleStatusSkeleton,
  SmallWidgetSkeleton,
} from "@/components/DashboardSkeletons";

const Index = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout>
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
          </>
        ) : (
          <>
            <KpiCard title="Active Shipments" value="1,284" change="+12.5% from last week" changeType="positive" icon={Package} gradient="blue" delay={0} />
            <KpiCard title="Fleet Vehicles" value="186" change="4 in maintenance" changeType="neutral" icon={Truck} gradient="green" delay={0.1} />
            <KpiCard title="On-Time Delivery" value="94.7%" change="+2.3% improvement" changeType="positive" icon={Clock} gradient="amber" delay={0.2} />
            <KpiCard title="Revenue (MTD)" value="$2.4M" change="-3.1% vs target" changeType="negative" icon={DollarSign} gradient="red" delay={0.3} />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            <DeliveryChart />
            <CostChart />
          </>
        )}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {loading ? <TableSkeleton /> : <ShipmentTable />}
        </div>
        <div className="space-y-4">
          {loading ? (
            <>
              <VehicleStatusSkeleton />
              <SmallWidgetSkeleton />
            </>
          ) : (
            <>
              <VehicleStatus />
              <SustainabilityWidget />
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
