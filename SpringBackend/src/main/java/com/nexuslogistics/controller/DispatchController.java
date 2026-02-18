package com.nexuslogistics.controller;

import com.nexuslogistics.model.Shipment;
import com.nexuslogistics.model.Vehicle;
import com.nexuslogistics.repository.ShipmentRepository;
import com.nexuslogistics.repository.VehicleRepository;
import com.nexuslogistics.service.RouteOptimizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/dispatch")
@CrossOrigin(origins = "*")
public class DispatchController {

    @Autowired
    private RouteOptimizationService routeOptimizationService;

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @PostMapping("/optimize/{vehicleId}")
    public ResponseEntity<List<Shipment>> getOptimizedRoute(@PathVariable Long vehicleId) {
        Optional<Vehicle> vehicleOpt = vehicleRepository.findById(vehicleId);
        if (vehicleOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Vehicle vehicle = vehicleOpt.get();
        List<Shipment> assignedShipments = shipmentRepository.findByAssignedVehicleId(vehicleId);

        if (assignedShipments.isEmpty()) {
            return ResponseEntity.ok(assignedShipments);
        }

        List<Shipment> optimized = routeOptimizationService.optimizeRoute(
            vehicle.getLatitude(), 
            vehicle.getLongitude(), 
            assignedShipments,
            vehicle.getMaxCapacity()
        );

        return ResponseEntity.ok(optimized);
    }
}
