package com.nexuslogistics.controller;

import com.nexuslogistics.service.SustainabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/sustainability")
@CrossOrigin(origins = "*")
public class SustainabilityController {

    @Autowired
    private SustainabilityService sustainabilityService;

    @GetMapping("/metrics")
    public Map<String, Object> getMetrics() {
        // In a real application, these would be calculated based on real trip data
        // using the sustainabilityService logic.
        return Map.of(
            "totalCo2Saved", 450.5, // kg
            "avgFleetEfficiency", 88, // percentage
            "greenRoutesPercentage", 72,
            "activeElectricVehicles", 5,
            "co2ReductionTarget", 1000.0,
            "nextMilestone", "500kg CO2 Reduction"
        );
    }
}
