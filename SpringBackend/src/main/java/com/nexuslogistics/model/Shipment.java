package com.nexuslogistics.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Shipment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String sId;
    private String customer;
    private String recipientName;
    private String origin;
    private String destination;
    private String destinationAddress;
    private String weight;
    private String status; // PENDING, IN_TRANSIT, DELIVERED, CANCELLED
    private LocalDateTime estimatedDeliveryTime;
    private LocalDateTime created;
    
    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle assignedVehicle;
}
