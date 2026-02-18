package com.nexuslogistics.controller;

import com.nexuslogistics.model.Vehicle;
import com.nexuslogistics.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "*") // For local development with Next.js
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    @GetMapping
    public List<Vehicle> getAllVehicles() {
        return vehicleService.getAllVehicles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id) {
        return vehicleService.getVehicleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Vehicle createVehicle(@RequestBody Vehicle vehicle) {
        return vehicleService.saveVehicle(vehicle);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicleData) {
        return vehicleService.getVehicleById(id).map(vehicle -> {
            vehicle.setVId(vehicleData.getVId());
            vehicle.setPlate(vehicleData.getPlate());
            vehicle.setName(vehicleData.getName());
            vehicle.setDriver(vehicleData.getDriver());
            vehicle.setStatus(vehicleData.getStatus());
            vehicle.setFuel(vehicleData.getFuel());
            vehicle.setMileage(vehicleData.getMileage());
            vehicle.setLastService(vehicleData.getLastService());
            vehicle.setTemp(vehicleData.getTemp());
            return ResponseEntity.ok(vehicleService.saveVehicle(vehicle));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/location")
    public ResponseEntity<Vehicle> updateLocation(
            @PathVariable Long id,
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam double speed) {
        Vehicle updatedVehicle = vehicleService.updateVehicleLocation(id, lat, lng, speed);
        return updatedVehicle != null ? ResponseEntity.ok(updatedVehicle) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }
}
