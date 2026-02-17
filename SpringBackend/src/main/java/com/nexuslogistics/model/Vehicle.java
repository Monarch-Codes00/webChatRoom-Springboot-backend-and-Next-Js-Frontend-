package com.nexuslogistics.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String vId; // Display ID (e.g. VN-101)
    private String plate;
    private String name; // Model name
    private String driver;
    private double latitude;
    private double longitude;
    private double speed;
    private double fuel;
    private double mileage;
    private String lastService;
    private Double temp;
    private String status;
}
