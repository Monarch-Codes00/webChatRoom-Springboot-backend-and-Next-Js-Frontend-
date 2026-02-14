package com.nexuslogistics.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDiagnostic {
    private String vin;
    private double engineTemp; // Celsius
    private double oilPressure; // PSI
    private double batteryVoltage;
    private int fuelLevel; // Percentage
    private List<String> faultCodes;
    private String status; // HEALTHY, WARNING, CRITICAL
}
