import React from "react";
import { usePermissions } from "@/hooks/usePermissions";

interface RoleGuardProps {
  permission: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * A utility component to conditionally render UI based on permissions.
 * Usage: <RoleGuard permission={canDeleteShipment}> <DeleteButton /> </RoleGuard>
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  permission, 
  children, 
  fallback = null 
}) => {
  if (!permission) return <>{fallback}</>;
  return <>{children}</>;
};
