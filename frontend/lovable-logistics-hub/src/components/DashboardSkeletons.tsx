import { Skeleton } from "@/components/ui/skeleton";

export const KpiCardSkeleton = () => (
  <div className="glass-card p-5">
    <div className="flex items-start justify-between">
      <div className="space-y-2.5">
        <Skeleton className="h-3 w-24 bg-secondary" />
        <Skeleton className="h-8 w-20 bg-secondary" />
        <Skeleton className="h-3 w-32 bg-secondary" />
      </div>
      <Skeleton className="w-11 h-11 rounded-xl bg-secondary" />
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="glass-card p-5">
    <div className="flex items-center justify-between mb-6">
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-36 bg-secondary" />
        <Skeleton className="h-3 w-48 bg-secondary" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-3 w-16 bg-secondary" />
        <Skeleton className="h-3 w-16 bg-secondary" />
      </div>
    </div>
    <div className="flex items-end gap-2 h-[240px] pt-4">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex-1 flex flex-col justify-end">
          <Skeleton
            className="w-full bg-secondary rounded-t"
            style={{ height: `${30 + Math.random() * 60}%` }}
          />
        </div>
      ))}
    </div>
  </div>
);

export const TableSkeleton = () => (
  <div className="glass-card overflow-hidden">
    <div className="flex items-center justify-between p-5 border-b border-border">
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-32 bg-secondary" />
        <Skeleton className="h-3 w-40 bg-secondary" />
      </div>
      <Skeleton className="h-3 w-16 bg-secondary" />
    </div>
    <div className="p-1">
      {/* Header */}
      <div className="flex gap-4 px-5 py-3 border-b border-border">
        {[80, 140, 72, 56, 80, 56].map((w, i) => (
          <Skeleton key={i} className="h-3 bg-secondary" style={{ width: w }} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-border/50">
          <Skeleton className="h-4 w-20 bg-secondary" />
          <Skeleton className="h-3 w-36 bg-secondary" />
          <Skeleton className="h-6 w-20 rounded-full bg-secondary" />
          <Skeleton className="h-3 w-14 bg-secondary" />
          <Skeleton className="h-3 w-24 bg-secondary" />
          <Skeleton className="h-3 w-16 bg-secondary" />
        </div>
      ))}
    </div>
  </div>
);

export const VehicleStatusSkeleton = () => (
  <div className="glass-card p-5">
    <div className="flex items-center justify-between mb-4">
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-24 bg-secondary" />
        <Skeleton className="h-3 w-40 bg-secondary" />
      </div>
      <Skeleton className="h-3 w-16 bg-secondary" />
    </div>
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 border border-border/50">
          <Skeleton className="w-9 h-9 rounded-lg bg-secondary" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-3.5 w-32 bg-secondary" />
              <Skeleton className="h-3 w-14 bg-secondary" />
            </div>
            <Skeleton className="h-3 w-28 bg-secondary" />
            <div className="flex gap-4">
              <Skeleton className="h-3 w-10 bg-secondary" />
              <Skeleton className="h-3 w-14 bg-secondary" />
              <Skeleton className="h-3 w-10 bg-secondary" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const SmallWidgetSkeleton = () => (
  <div className="glass-card p-5">
    <div className="flex items-center gap-2 mb-4">
      <Skeleton className="w-8 h-8 rounded-lg bg-secondary" />
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-24 bg-secondary" />
        <Skeleton className="h-3 w-40 bg-secondary" />
      </div>
    </div>
    <div className="space-y-4">
      <div>
        <div className="flex justify-between mb-1.5">
          <Skeleton className="h-3 w-20 bg-secondary" />
          <Skeleton className="h-3 w-16 bg-secondary" />
        </div>
        <Skeleton className="h-2 w-full rounded-full bg-secondary" />
      </div>
      <div>
        <div className="flex justify-between mb-1.5">
          <Skeleton className="h-3 w-28 bg-secondary" />
          <Skeleton className="h-3 w-10 bg-secondary" />
        </div>
        <Skeleton className="h-2 w-full rounded-full bg-secondary" />
      </div>
      <Skeleton className="h-10 w-full rounded-lg bg-secondary" />
    </div>
  </div>
);

// Fleet page skeletons
export const FleetCardSkeleton = () => (
  <div className="glass-card p-5">
    <div className="flex items-start justify-between mb-3">
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-36 bg-secondary" />
        <Skeleton className="h-3 w-28 bg-secondary" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full bg-secondary" />
    </div>
    <Skeleton className="h-3 w-32 bg-secondary mb-3" />
    <div className="grid grid-cols-3 gap-2 mb-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-16 rounded-lg bg-secondary" />
      ))}
    </div>
    <div className="flex items-center justify-between pt-3 border-t border-border">
      <Skeleton className="h-3 w-28 bg-secondary" />
      <Skeleton className="h-3 w-20 bg-secondary" />
    </div>
  </div>
);

// Shipments page skeletons
export const ShipmentsTableSkeleton = () => (
  <div className="glass-card overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {[60, 80, 160, 80, 60, 80, 60, 70].map((w, i) => (
              <th key={i} className="px-5 py-3"><Skeleton className="h-3 bg-secondary" style={{ width: w }} /></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 8 }).map((_, i) => (
            <tr key={i} className="border-b border-border/50">
              <td className="px-5 py-3"><Skeleton className="h-4 w-20 bg-secondary" /></td>
              <td className="px-5 py-3"><Skeleton className="h-3 w-24 bg-secondary" /></td>
              <td className="px-5 py-3"><Skeleton className="h-3 w-40 bg-secondary" /></td>
              <td className="px-5 py-3"><Skeleton className="h-6 w-20 rounded-full bg-secondary" /></td>
              <td className="px-5 py-3"><Skeleton className="h-3 w-16 bg-secondary" /></td>
              <td className="px-5 py-3"><Skeleton className="h-3 w-24 bg-secondary" /></td>
              <td className="px-5 py-3"><Skeleton className="h-3 w-16 bg-secondary" /></td>
              <td className="px-5 py-3"><Skeleton className="h-3 w-20 bg-secondary" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Sensor grid skeleton for Telematics
export const SensorCardSkeleton = () => (
  <div className="glass-card p-4 text-center">
    <Skeleton className="w-5 h-5 mx-auto mb-2 rounded bg-secondary" />
    <Skeleton className="h-5 w-14 mx-auto mb-1 bg-secondary" />
    <Skeleton className="h-2.5 w-20 mx-auto bg-secondary" />
  </div>
);

// Alert skeleton for Telematics
export const AlertSkeleton = () => (
  <div className="glass-card p-5">
    <div className="flex items-center gap-2 mb-4">
      <Skeleton className="w-4 h-4 rounded bg-secondary" />
      <Skeleton className="h-4 w-28 bg-secondary" />
    </div>
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-secondary/10">
          <Skeleton className="w-2 h-2 rounded-full mt-1.5 bg-secondary" />
          <div className="flex-1 space-y-1.5">
            <div className="flex justify-between">
              <Skeleton className="h-3.5 w-40 bg-secondary" />
              <Skeleton className="h-3 w-16 bg-secondary" />
            </div>
            <Skeleton className="h-3 w-64 bg-secondary" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Document list skeleton for Compliance
export const DocumentListSkeleton = () => (
  <div className="glass-card overflow-hidden">
    <div className="flex items-center justify-between p-5 border-b border-border">
      <div className="flex items-center gap-2">
        <Skeleton className="w-4 h-4 rounded bg-secondary" />
        <Skeleton className="h-4 w-28 bg-secondary" />
      </div>
    </div>
    <div className="divide-y divide-border/50">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between px-5 py-3">
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-40 bg-secondary" />
            <Skeleton className="h-3 w-32 bg-secondary" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-24 rounded-full bg-secondary" />
            <Skeleton className="w-6 h-6 rounded bg-secondary" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Settings form skeleton
export const SettingsFormSkeleton = () => (
  <div className="glass-card p-5">
    <div className="flex items-center gap-2 mb-4">
      <Skeleton className="w-4 h-4 rounded bg-secondary" />
      <Skeleton className="h-4 w-20 bg-secondary" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i}>
          <Skeleton className="h-3 w-20 mb-1 bg-secondary" />
          <Skeleton className="h-10 w-full rounded-lg bg-secondary" />
        </div>
      ))}
    </div>
    <Skeleton className="h-9 w-28 rounded-lg bg-secondary mt-4" />
  </div>
);

export const SettingsToggleSkeleton = () => (
  <div className="glass-card p-5">
    <div className="flex items-center gap-2 mb-4">
      <Skeleton className="w-4 h-4 rounded bg-secondary" />
      <Skeleton className="h-4 w-28 bg-secondary" />
    </div>
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-2">
          <Skeleton className="h-3.5 w-56 bg-secondary" />
          <Skeleton className="w-10 h-5 rounded-full bg-secondary" />
        </div>
      ))}
    </div>
  </div>
);

// Map skeleton
export const MapSkeleton = () => (
  <div className="glass-card relative overflow-hidden" style={{ minHeight: 500 }}>
    <Skeleton className="absolute inset-0 rounded-none bg-secondary" />
  </div>
);

export const MapVehicleListSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="h-3 w-28 bg-secondary" />
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="glass-card p-3 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="w-2 h-2 rounded-full bg-secondary" />
          <Skeleton className="h-3.5 w-32 bg-secondary" />
        </div>
        <Skeleton className="h-3 w-40 bg-secondary" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-20 bg-secondary" />
          <Skeleton className="h-3 w-16 bg-secondary" />
        </div>
      </div>
    ))}
  </div>
);

// ESG Score skeleton
export const EsgScoreSkeleton = () => (
  <div className="glass-card p-5">
    <Skeleton className="h-4 w-36 mb-4 bg-secondary" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 rounded-lg bg-secondary/30 border border-border/50 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-3.5 w-24 bg-secondary" />
            <Skeleton className="h-5 w-10 bg-secondary" />
          </div>
          <Skeleton className="h-2 w-full rounded-full bg-secondary" />
          <Skeleton className="h-3 w-16 bg-secondary" />
        </div>
      ))}
    </div>
  </div>
);
