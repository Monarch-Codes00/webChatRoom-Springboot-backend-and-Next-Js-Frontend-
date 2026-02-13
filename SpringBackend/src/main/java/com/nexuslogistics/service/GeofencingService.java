package com.nexuslogistics.service;

import com.nexuslogistics.model.Shipment;
import com.nexuslogistics.model.Vehicle;
import org.springframework.stereotype.Service;

@Service
public class GeofencingService {

    // Radius in meters to trigger an arrival event
    private static final double ARRIVAL_THRESHOLD_METERS = 500.0;

    /**
     * Checks if a vehicle has entered the geofence of its active shipment.
     */
    public boolean checkArrival(double vehicleLat, double vehicleLng, double destLat, double destLng) {
        double distance = calculateDistanceInMeters(vehicleLat, vehicleLng, destLat, destLng);
        return distance <= ARRIVAL_THRESHOLD_METERS;
    }

    private double calculateDistanceInMeters(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c * 1000.0; // Convert to meters
    }
}
