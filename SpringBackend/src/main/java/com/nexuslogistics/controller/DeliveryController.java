package com.nexuslogistics.controller;

import com.nexuslogistics.model.Shipment;
import com.nexuslogistics.service.ShipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shipments")
@CrossOrigin(origins = "*")
public class DeliveryController {

    @Autowired
    private ShipmentService shipmentService;

    @GetMapping
    public List<Shipment> getAllShipments() {
        return shipmentService.getAllShipments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shipment> getShipmentById(@PathVariable Long id) {
        return shipmentService.getShipmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Shipment createShipment(@RequestBody Shipment shipment) {
        return shipmentService.saveShipment(shipment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Shipment> updateShipment(@PathVariable Long id, @RequestBody Shipment shipmentData) {
        return shipmentService.getShipmentById(id).map(shipment -> {
            shipment.setSId(shipmentData.getSId());
            shipment.setCustomer(shipmentData.getCustomer());
            shipment.setRecipientName(shipmentData.getRecipientName());
            shipment.setOrigin(shipmentData.getOrigin());
            shipment.setDestination(shipmentData.getDestination());
            shipment.setDestinationAddress(shipmentData.getDestinationAddress());
            shipment.setWeight(shipmentData.getWeight());
            shipment.setStatus(shipmentData.getStatus());
            shipment.setEstimatedDeliveryTime(shipmentData.getEstimatedDeliveryTime());
            return ResponseEntity.ok(shipmentService.saveShipment(shipment));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShipment(@PathVariable Long id) {
        shipmentService.deleteShipment(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Endpoint for drivers to submit Proof of Delivery (Signature & Photo).
     */
    @PostMapping("/{id}/complete")
    public ResponseEntity<String> completeDelivery(
            @PathVariable Long id,
            @RequestParam("signature") String signatureData, // Base64 signature
            @RequestParam(value = "photo", required = false) MultipartFile photo) {
        
        // In a real app, we would save the photo to S3/Cloud and store the URL.
        // For now, we simulate the logic.
        
        System.out.println("Processing e-POD for Shipment: " + id);
        if (photo != null) {
            System.out.println("Received photo: " + photo.getOriginalFilename());
        }
        
        shipmentService.updateStatus(id, "DELIVERED");
        
        return ResponseEntity.ok("Delivery completed and e-POD logged successfully.");
    }
}
