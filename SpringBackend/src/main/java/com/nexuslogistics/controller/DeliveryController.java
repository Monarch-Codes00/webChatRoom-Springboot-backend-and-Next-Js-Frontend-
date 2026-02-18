package com.nexuslogistics.controller;

import com.nexuslogistics.dto.ShipmentDTO;
import com.nexuslogistics.model.Shipment;
import com.nexuslogistics.service.ShipmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/shipments")
@CrossOrigin(origins = "*")
public class DeliveryController {

    @Autowired
    private ShipmentService shipmentService;

    @GetMapping
    public List<ShipmentDTO> getAllShipments() {
        return shipmentService.getAllShipments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShipmentDTO> getShipmentById(@PathVariable Long id) {
        return shipmentService.getShipmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ShipmentDTO> createShipment(@Valid @RequestBody ShipmentDTO shipmentDTO) {
        return ResponseEntity.ok(shipmentService.saveShipment(shipmentDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShipmentDTO> updateShipment(@PathVariable Long id, @Valid @RequestBody ShipmentDTO shipmentData) {
        shipmentData.setId(id);
        return ResponseEntity.ok(shipmentService.saveShipment(shipmentData));
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
            @RequestParam("signature") String signatureData,
            @RequestParam(value = "photo", required = false) MultipartFile photo,
            @RequestParam("lat") double lat,
            @RequestParam("lng") double lng) {
        
        // Mocking photo upload: in production this returns a URL from S3/CDN
        String photoUrl = (photo != null) ? "uploads/" + photo.getOriginalFilename() : null;
        
        shipmentService.completeDelivery(id, signatureData, photoUrl, lat, lng);
        
        return ResponseEntity.ok("e-POD logged at [" + lat + ", " + lng + "]. Shipment finalized.");
    }
}
