import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user && user.token) {
      config.headers["Authorization"] = "Bearer " + user.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Unauthorized: token expired or invalid
        localStorage.removeItem("user");
        window.location.href = "/";
      } else if (error.response.status === 403) {
        // Forbidden: insufficient permissions
        console.error("Access Forbidden: You do not have permission for this action.");
      }
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Authentication
  login: async (credentials: any) => {
    const resp = await api.post("/auth/signin", credentials);
    if (resp.data.token) {
      localStorage.setItem("user", JSON.stringify(resp.data));
    }
    return resp.data;
  },

  logout: () => {
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem("user") || "null");
  },

  // Fleet & Vehicles
  getVehicles: async () => {
    const resp = await api.get("/vehicles");
    const data = resp.data.map((v: any) => ({
      ...v,
      id: v.vId, // Map for UI display
      dbId: v.id,
      status: v.status.toLowerCase(),
      driver: v.driver?.user?.username || "Unassigned"
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
      driver: s.assignedVehicle?.driver?.user?.username || "Unassigned",
      weight: s.weightKg + " kg",
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
    driver: data.driver || null,
    status: (data.status || "ACTIVE").toUpperCase(),
    latitude: 37.7749, // Should ideally be picked from map
    longitude: -122.4194,
    speed: 0,
    maxCapacity: data.maxCapacity || 25000
  }),
  
  updateVehicle: (id: string | number, data: any) => api.put(`/vehicles/${id}`, {
    ...data,
    status: data.status.toUpperCase()
  }),
  deleteVehicle: (id: string | number) => api.delete(`/vehicles/${id}`),
  
  createShipment: (data: any) => api.post("/shipments", {
    sId: data.sId || data.id,
    customer: data.customer,
    recipientName: data.recipientName || "Receiver",
    origin: data.origin,
    destination: data.destination,
    destinationAddress: data.destinationAddress || (data.destination + " Main St"),
    weightKg: parseFloat(data.weight) || 0,
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
