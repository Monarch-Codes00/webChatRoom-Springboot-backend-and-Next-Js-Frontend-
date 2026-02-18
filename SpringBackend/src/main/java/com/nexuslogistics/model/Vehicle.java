package com.nexuslogistics.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String vId; // Display ID (e.g. VN-101)
    private String plate;
    private String name; // Model name
    @ManyToOne
    @JoinColumn(name = "driver_id")
    private DriverProfile driver;
    private double latitude;
    private double longitude;
    private double speed;
    private double fuel;
    private double mileage;
    private String lastService;
    private Double temp;
    private String status;
    private double maxCapacity; // in kg or tons
}
