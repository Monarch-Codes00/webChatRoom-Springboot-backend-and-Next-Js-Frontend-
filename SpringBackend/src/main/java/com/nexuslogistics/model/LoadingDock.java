package com.nexuslogistics.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoadingDock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String dockNumber;
    private String status; // AVAILABLE, OCCUPIED, MAINTENANCE, RESERVED
    private String assignedVehicleNumber;
    private String currentActivity; // LOADING, UNLOADING, IDLE
    private int estimatedTurnaroundTime; // minutes
}
