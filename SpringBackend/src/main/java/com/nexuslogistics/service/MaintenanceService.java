package com.nexuslogistics.service;

import com.nexuslogistics.model.Vehicle;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class MaintenanceService {

    private static final double OIL_CHANGE_INTERVAL = 15000.0; // km
    private static final double TIRE_ROTATION_INTERVAL = 10000.0; // km

    /**
     * Predicts maintenance needs based on vehicle mileage and historical logs.
     * Returns a map of component -> percentage of life remaining.
     */
    public Map<String, Double> getMaintenancePrediction(double totalMileageKm) {
        Map<String, Double> healthMap = new HashMap<>();

        // Oil Life Prediction
        double oilLife = 100 - ((totalMileageKm % OIL_CHANGE_INTERVAL) / OIL_CHANGE_INTERVAL * 100);
        healthMap.put("Oil Health", Math.max(0, oilLife));

        // Tires Life Prediction
        double tireLife = 100 - ((totalMileageKm % TIRE_ROTATION_INTERVAL) / TIRE_ROTATION_INTERVAL * 100);
        healthMap.put("Tire Integrity", Math.max(0, tireLife));

        // Braking System (Mocked based on mileage)
        double brakeLife = Math.max(0, 100 - (totalMileageKm / 500.0)); // Simplified decay
        healthMap.put("Brake Pads", brakeLife);

        return healthMap;
    }

    public boolean isUrgentMaintenanceRequired(double totalMileageKm) {
        return getMaintenancePrediction(totalMileageKm).values().stream().anyMatch(val -> val < 10.0);
    }
}
