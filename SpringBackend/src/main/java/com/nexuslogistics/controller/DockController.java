package com.nexuslogistics.controller;

import com.nexuslogistics.model.LoadingDock;
import com.nexuslogistics.repository.LoadingDockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/docks")
public class DockController {

    @Autowired
    private LoadingDockRepository dockRepository;

    @GetMapping
    public List<LoadingDock> getAllDocks() {
        return dockRepository.findAll();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<LoadingDock> updateDockStatus(
            @PathVariable Long id, 
            @RequestParam String status,
            @RequestParam(required = false) String vehicleNumber) {
        
        return dockRepository.findById(id).map(dock -> {
            dock.setStatus(status);
            if (vehicleNumber != null) {
                dock.setAssignedVehicleNumber(vehicleNumber);
            }
            return ResponseEntity.ok(dockRepository.save(dock));
        }).orElse(ResponseEntity.notFound().build());
    }
}
