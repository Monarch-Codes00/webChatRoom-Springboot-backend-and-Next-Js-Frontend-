package com.nexuslogistics.service;

import com.nexuslogistics.model.Shipment;
import com.nexuslogistics.model.Vehicle;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@Slf4j
public class GeofencingService {

    @Autowired
    private NotificationService notificationService;

    // Radius in meters to trigger an arrival event
    private static final double ARRIVAL_THRESHOLD_METERS = 800.0;

    // Track active geofence breaches to avoid duplicates
    private final Set<String> activeAlerts = new HashSet<>();

    public void evaluateShipmentGeofence(Vehicle vehicle, Shipment shipment) {
        if (shipment == null || !"IN_TRANSIT".equals(shipment.getStatus())) return;

        double distance = calculateDistanceInMeters(
            vehicle.getLatitude(), vehicle.getLongitude(), 
            shipment.getLatitude(), shipment.getLongitude()
        );

        String alertKey = vehicle.getVId() + ":" + shipment.getSId();

        if (distance <= ARRIVAL_THRESHOLD_METERS) {
            if (!activeAlerts.contains(alertKey)) {
                log.info("GEOFENCE TRIGGER: Vehicle {} is nearing destination for Shipment {}", 
                        vehicle.getVId(), shipment.getSId());
                
                notificationService.broadcastSystemUpdate(
                    String.format("Vehicle %s is within 800m of destination %s", 
                        vehicle.getVId(), shipment.getDestination())
                );
                
                activeAlerts.add(alertKey);
            }
        } else {
            // Vehicle moved away or hasn't arrived yet
            activeAlerts.remove(alertKey);
        }
    }

    private double calculateDistanceInMeters(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c * 1000.0;
    }
}
