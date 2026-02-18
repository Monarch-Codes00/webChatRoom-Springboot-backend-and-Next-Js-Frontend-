package com.nexuslogistics.service;

import com.nexuslogistics.model.Shipment;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RouteOptimizationService {

    /**
     * Simple Greedy Algorithm for traveling salesman problem (TSP) variant.
     * Orders shipments based on proximity to the last location to minimize travel distance.
     */
    public List<Shipment> optimizeRoute(double startLat, double startLng, List<Shipment> shipments) {
        if (shipments == null || shipments.isEmpty()) {
            return new ArrayList<>();
        }

        List<Shipment> unvisited = new ArrayList<>(shipments);
        List<Shipment> optimizedPath = new ArrayList<>();

        double currentLat = startLat;
        double currentLng = startLng;

        while (!unvisited.isEmpty()) {
            Shipment nearest = null;
            double minDistance = Double.MAX_VALUE;

            for (Shipment shipment : unvisited) {
                double distance = calculateHaversine(currentLat, currentLng, shipment.getLatitude(), shipment.getLongitude());
                if (distance < minDistance) {
                    minDistance = distance;
                    nearest = shipment;
                }
            }

            if (nearest != null) {
                optimizedPath.add(nearest);
                unvisited.remove(nearest);
                currentLat = nearest.getLatitude();
                currentLng = nearest.getLongitude();
            }
        }

        return optimizedPath;
    }

    /**
     * Calculates the great-circle distance between two points on a sphere.
     */
    private double calculateHaversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
