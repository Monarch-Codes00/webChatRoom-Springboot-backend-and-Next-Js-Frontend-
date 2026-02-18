package com.nexuslogistics.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDTO {
    private Long id;
    
    @NotBlank(message = "Vehicle display ID is required")
    private String vId;
    
    @NotBlank(message = "License plate is required")
    private String plate;
    
    @NotBlank(message = "Model name is required")
    private String name;
    
    private String driver;
    
    @NotNull(message = "Latitude is required")
    private Double latitude;
    
    @NotNull(message = "Longitude is required")
    private Double longitude;
    
    private double speed;
    private double fuel;
    private double mileage;
    private String lastService;
    private Double temp;
    
    @NotBlank(message = "Status is required")
    private String status;
}
