package com.nexuslogistics.service;

import com.nexuslogistics.model.Vehicle;
import org.springframework.stereotype.Service;

@Service
public class SustainabilityService {

    // Avg CO2 grams per km for heavy duty trucks (Reference value)
    private static final double AVG_CO2_PER_KM = 800.0; 

    /**
     * Calculates estimated CO2 emissions for a trip.
     */
    public double calculateCarbonFootprint(double distanceKm, String fuelType) {
        double multiplier = 1.0;
        
        if (fuelType != null) {
            switch (fuelType.toUpperCase()) {
                case "ELECTRIC": multiplier = 0.15; break;
                case "HYBRID": multiplier = 0.60; break;
                case "DIESEL": multiplier = 1.10; break;
                default: multiplier = 1.0;
            }
        }
        
        return distanceKm * AVG_CO2_PER_KM * multiplier;
    }

    /**
     * Scores a driver based on their eco-efficiency (speed vs fuel consumption patterns)
     */
    public int calculateEcoScore(double avgSpeed, double idleTimeMinutes) {
        // Ideal efficiency speed for trucks is usually 50-60 mph (80-90 kmh)
        int score = 100;
        
        if (avgSpeed > 100) score -= 20; // Speeding reduces efficiency
        if (idleTimeMinutes > 15) score -= 15; // Excessive idling
        
        return Math.max(0, score);
    }
}
