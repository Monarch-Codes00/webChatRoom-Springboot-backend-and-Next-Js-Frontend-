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
    private String dockType; // Standard, Cold Storage, Express
    private String status; // AVAILABLE, OCCUPIED, MAINTENANCE, RESERVED
    private String assignedVId;
    private String currentActivity; // LOADING, UNLOADING, IDLE
    private int estimatedTurnaroundTime; // minutes
}
