import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const apiService = {
  // Fleet & Vehicles
  getVehicles: async () => {
    const resp = await api.get("/vehicles");
    const data = resp.data.map((v: any) => ({
      ...v,
      id: v.vId, // Map for UI display
      dbId: v.id,
      status: v.status.toLowerCase()
    }));
    return { ...resp, data };
  },

  getVehicleDiagnostics: (id: string | number) => api.get(`/diagnostics/${id}`),

  // Shipments
  getShipments: async () => {
    const resp = await api.get("/shipments");
    const data = resp.data.map((s: any) => ({
      ...s,
      id: s.sId, // Map display ID
      dbId: s.id, // Keep database ID for operations
      status: s.status.charAt(0) + s.status.slice(1).toLowerCase().replace('_', ' '),
      statusType: s.status === 'IN_TRANSIT' ? 'active' : s.status === 'PENDING' ? 'warning' : 'danger',
      eta: s.status === 'DELIVERED' ? 'Completed' : '4h 30m', // Mock relative time
      driver: s.assignedVehicle?.driver || "Unassigned",
      created: s.created ? new Date(s.created).toLocaleDateString() : "Today"
    }));
    return { ...resp, data };
  },

  getWaybill: (shipmentId: string | number) => api.get(`/documents/waybill/${shipmentId}`),

  // Warehouse & Docks
  getDocks: async () => {
    const resp = await api.get("/docks");
    const data = resp.data.map((d: any) => ({
      ...d,
      name: d.dockNumber,
      type: d.dockType,
      status: d.status.charAt(0) + d.status.slice(1).toLowerCase(),
      vehicle: d.assignedVId,
      active: d.currentActivity,
      tt: d.estimatedTurnaroundTime + "m"
    }));
    return { ...resp, data };
  },

  updateDockStatus: (id: number, status: string, vId?: string) => 
    api.put(`/docks/${id}/status`, null, { params: { status: status.toUpperCase(), vId } }),

  // Create Operations
  createVehicle: (data: any) => api.post("/vehicles", {
    ...data,
    vId: data.vId || data.id,
    driver: data.driver || "Unassigned",
    status: (data.status || "ACTIVE").toUpperCase(),
    latitude: 37.7749, // Default
    longitude: -122.4194,
    speed: 0
  }),
  
  updateVehicle: (id: string | number, data: any) => api.put(`/vehicles/${id}`, {
    ...data,
    status: data.status.toUpperCase()
  }),
  deleteVehicle: (id: string | number) => api.delete(`/vehicles/${id}`),
  
  createShipment: (data: any) => api.post("/shipments", {
    sId: data.sId || data.id,
    customer: data.customer,
    recipientName: "Receiver",
    origin: data.origin,
    destination: data.destination,
    destinationAddress: data.destination + " Main St",
    weight: data.weight,
    status: "PENDING"
  }),
  
  updateShipment: (id: string | number, data: any) => api.put(`/shipments/${id}`, {
    ...data,
    status: data.status.toUpperCase()
  }),
  deleteShipment: (id: string | number) => api.delete(`/shipments/${id}`),

  // Sustainability & Analytics
  getLeaderboard: () => api.get("/leaderboard"),
  getSustainabilityMetrics: () => api.get("/sustainability/metrics"),
};

export default api;
