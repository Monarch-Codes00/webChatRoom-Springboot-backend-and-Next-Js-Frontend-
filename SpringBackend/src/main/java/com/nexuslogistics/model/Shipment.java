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
    private String shipmentNumber;
    private String senderName;
    private String recipientName;
    private String destinationAddress;
    private String status; // PENDING, IN_TRANSIT, DELIVERED, CANCELLED
    private LocalDateTime estimatedDeliveryTime;
    
    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle assignedVehicle;
}
