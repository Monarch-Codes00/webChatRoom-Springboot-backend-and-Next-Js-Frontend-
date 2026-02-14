package com.nexuslogistics.controller;

import com.nexuslogistics.model.VehicleDiagnostic;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/diagnostics")
public class DiagnosticController {

    @GetMapping("/{vehicleId}")
    public VehicleDiagnostic getDiagnostics(@PathVariable Long vehicleId) {
        // Mocking live OBD-II data
        List<String> codes = new ArrayList<>();
        String status = "HEALTHY";
        
        if (Math.random() > 0.8) {
            codes.add("P0300 - Random/Multiple Cylinder Misfire Detected");
            status = "WARNING";
        }

        return VehicleDiagnostic.builder()
                .vin("1NXP" + vehicleId + "HUB" + (int)(Math.random() * 1000))
                .engineTemp(90 + (Math.random() * 15))
                .oilPressure(45 + (Math.random() * 10))
                .batteryVoltage(13.8 + (Math.random() * 1.2))
                .fuelLevel((int)(20 + (Math.random() * 80)))
                .faultCodes(codes)
                .status(status)
                .build();
    }
}
