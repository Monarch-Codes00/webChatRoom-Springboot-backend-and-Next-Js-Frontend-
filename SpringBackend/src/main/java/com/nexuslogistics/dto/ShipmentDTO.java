package com.nexuslogistics.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentDTO {
    private Long id;
    
    @NotBlank(message = "Shipment ID is required")
    private String sId;
    
    @NotBlank(message = "Customer name is required")
    private String customer;
    
    @NotBlank(message = "Recipient name is required")
    private String recipientName;
    
    @NotBlank(message = "Origin is required")
    private String origin;
    
    @NotBlank(message = "Destination is required")
    private String destination;
    
    @NotBlank(message = "Destination address is required")
    private String destinationAddress;
    
    private String weight;
    
    @NotBlank(message = "Status is required")
    private String status;
    
    private double latitude;
    private double longitude;
    private LocalDateTime estimatedDeliveryTime;
    private LocalDateTime created;
    private Long assignedVehicleId;
}
