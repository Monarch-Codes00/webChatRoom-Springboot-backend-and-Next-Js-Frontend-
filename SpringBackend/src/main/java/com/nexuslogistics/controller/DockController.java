package com.nexuslogistics.controller;

import com.nexuslogistics.model.LoadingDock;
import com.nexuslogistics.repository.LoadingDockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/docks")
@CrossOrigin(origins = "*")
public class DockController {

    @Autowired
    private com.nexuslogistics.service.LoadingDockService dockService;

    @GetMapping
    public List<LoadingDock> getAllDocks() {
        return dockService.getAllDocks();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<LoadingDock> updateDockStatus(
            @PathVariable Long id, 
            @RequestParam String status,
            @RequestParam(required = false) String vId) {
        
        return dockService.assignVehicle(id, vId, status)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
