import { useAuth } from "./useAuth";

export type Role = "admin" | "warehouse" | "driver";

export interface Permissions {
  role: Role;
  // Navigation
  canAccessFleet: boolean;
  canAccessWarehouse: boolean;
  canAccessShipments: boolean;
  canAccessAnalytics: boolean;
  canAccessTelematics: boolean;
  canAccessSustainability: boolean;
  canAccessCompliance: boolean;
  canAccessDriverPortal: boolean;
  canAccessSettings: boolean;
  canAccessLiveMap: boolean;

  // Actions
  canCreateShipment: boolean;
  canEditShipment: boolean;
  canDeleteShipment: boolean;
  canAssignVehicles: boolean;
  canPerformDVIR: boolean;
  canSignPOD: boolean;
  canManageFleet: boolean;
  canViewInternalKPIs: boolean; // Professional/Financial metrics
}

export const usePermissions = (): Permissions => {
  const { user } = useAuth();
  
  // Default to 'admin' for development if no role is set
  const role = (user?.role?.toLowerCase() as Role) || "admin";

  return {
    role,
    // Navigation Access
    canAccessFleet: role === "admin",
    canAccessWarehouse: ["admin", "warehouse"].includes(role),
    canAccessShipments: ["admin", "warehouse"].includes(role),
    canAccessAnalytics: role === "admin",
    canAccessTelematics: role === "admin",
    canAccessSustainability: role === "admin",
    canAccessCompliance: role === "admin",
    canAccessDriverPortal: ["admin", "driver"].includes(role),
    canAccessSettings: true,
    canAccessLiveMap: true,

    // Action-based Permissions
    canCreateShipment: ["admin", "warehouse"].includes(role),
    canEditShipment: ["admin", "warehouse"].includes(role),
    canDeleteShipment: role === "admin",
    canAssignVehicles: ["admin", "warehouse"].includes(role),
    canPerformDVIR: role === "driver",
    canSignPOD: role === "driver",
    canManageFleet: role === "admin",
    canViewInternalKPIs: role === "admin",
  };
};
