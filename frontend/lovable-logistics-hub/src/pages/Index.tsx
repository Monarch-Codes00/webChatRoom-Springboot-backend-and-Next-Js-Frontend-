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

import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/apiService";
import { useUser } from "@clerk/clerk-react";

const Index = () => {
  const { user } = useUser();
  const role = (user?.publicMetadata?.role as string) || "admin";

  const { data: metrics, isLoading } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      // Return default empty state for now
      return {
        activeShipments: "0",
        fleetVehicles: "0",
        onTimeDelivery: "0%",
        revenue: "$0.0M"
      };
    },
    initialData: {
      activeShipments: "0",
      fleetVehicles: "0",
      onTimeDelivery: "0%",
      revenue: "$0.0M"
    }
  });

  return (
    <DashboardLayout>
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
          </>
        ) : (
          <>
            <KpiCard title="Active Shipments" value={metrics.activeShipments} change="+0% from last week" changeType="neutral" icon={Package} gradient="blue" delay={0} />
            {role === "admin" && (
              <KpiCard title="Fleet Vehicles" value={metrics.fleetVehicles} change="0 in maintenance" changeType="neutral" icon={Truck} gradient="green" delay={0.1} />
            )}
            <KpiCard title="On-Time Delivery" value={metrics.onTimeDelivery} change="+0% improvement" changeType="neutral" icon={Clock} gradient="amber" delay={0.2} />
            {role === "admin" && (
              <KpiCard title="Revenue (MTD)" value={metrics.revenue} change="+0% vs target" changeType="neutral" icon={DollarSign} gradient="red" delay={0.3} />
            )}
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {isLoading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            <DeliveryChart />
            {role === "admin" && <CostChart />}
          </>
        )}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {isLoading ? <TableSkeleton /> : <ShipmentTable />}
        </div>
        <div className="space-y-4">
          {isLoading ? (
            <>
              <VehicleStatusSkeleton />
              <SmallWidgetSkeleton />
            </>
          ) : (
            <>
              {role === "admin" && <VehicleStatus />}
              <SustainabilityWidget />
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
