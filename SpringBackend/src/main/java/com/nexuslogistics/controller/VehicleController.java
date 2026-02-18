package com.nexuslogistics.controller;

import com.nexuslogistics.dto.VehicleDTO;
import com.nexuslogistics.model.Vehicle;
import com.nexuslogistics.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "*") 
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    @GetMapping
    public List<VehicleDTO> getAllVehicles() {
        return vehicleService.getAllVehicles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleDTO> getVehicleById(@PathVariable Long id) {
        return vehicleService.getVehicleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<VehicleDTO> createVehicle(@Valid @RequestBody VehicleDTO vehicleDTO) {
        return ResponseEntity.ok(vehicleService.saveVehicle(vehicleDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VehicleDTO> updateVehicle(@PathVariable Long id, @Valid @RequestBody VehicleDTO vehicleData) {
        vehicleData.setId(id);
        return ResponseEntity.ok(vehicleService.saveVehicle(vehicleData));
    }

    @PutMapping("/{id}/location")
    public ResponseEntity<VehicleDTO> updateLocation(
            @PathVariable Long id,
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam double speed) {
        VehicleDTO updatedVehicle = vehicleService.updateVehicleLocation(id, lat, lng, speed);
        return updatedVehicle != null ? ResponseEntity.ok(updatedVehicle) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }
}
