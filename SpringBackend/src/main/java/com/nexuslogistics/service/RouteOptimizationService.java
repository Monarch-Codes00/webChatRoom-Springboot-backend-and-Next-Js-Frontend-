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
                // Parsing mock coordinates from address or using dummy values for now 
                // In a real app, we would have lat/lng stored per shipment stop
                double shipLat = extractLat(shipment.getDestinationAddress());
                double shipLng = extractLng(shipment.getDestinationAddress());

                double distance = calculateHaversine(currentLat, currentLng, shipLat, shipLng);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearest = shipment;
                }
            }

            if (nearest != null) {
                optimizedPath.add(nearest);
                unvisited.remove(nearest);
                currentLat = extractLat(nearest.getDestinationAddress());
                currentLng = extractLng(nearest.getDestinationAddress());
            }
        }

        return optimizedPath;
    }

    private double calculateHaversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // Mock extractors - In production, these would be fields in the Shipment entity populated via Geocoding
    private double extractLat(String address) {
        // Dummy logic: hash the address string to get a consistent dummy coordinate
        return 37.7749 + (address.hashCode() % 100) / 1000.0;
    }

    private double extractLng(String address) {
        return -122.4194 + (address.hashCode() % 100) / 1000.0;
    }
}
