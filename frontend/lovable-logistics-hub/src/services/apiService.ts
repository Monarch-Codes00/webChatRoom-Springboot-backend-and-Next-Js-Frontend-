import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const apiService = {
  // Fleet & Vehicles
  getVehicles: () => api.get("/vehicles"),
  getVehicleDiagnostics: (id: string | number) => api.get(`/diagnostics/${id}`),

  // Shipments
  getShipments: () => api.get("/shipments"),
  getWaybill: (shipmentId: string | number) => api.get(`/documents/waybill/${shipmentId}`),

  // Warehouse & Docks
  getDocks: () => api.get("/docks"),
  updateDockStatus: (id: number, status: string, vehicleNumber?: string) => 
    api.put(`/docks/${id}/status`, null, { params: { status, vehicleNumber } }),

  // Create Operations
  createVehicle: (data: any) => api.post("/vehicles", data),
  createShipment: (data: any) => api.post("/shipments", data),

  // Sustainability & Analytics
  getLeaderboard: () => api.get("/leaderboard"),
  getSustainabilityMetrics: () => api.get("/sustainability/metrics"),
};

export default api;
