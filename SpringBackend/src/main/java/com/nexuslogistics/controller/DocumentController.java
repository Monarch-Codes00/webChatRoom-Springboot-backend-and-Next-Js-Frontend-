package com.nexuslogistics.controller;

import com.nexuslogistics.model.Shipment;
import com.nexuslogistics.model.Waybill;
import com.nexuslogistics.service.DocumentService;
import com.nexuslogistics.service.ShipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @Autowired
    private ShipmentService shipmentService;

    @GetMapping("/waybill/{shipmentId}")
    public ResponseEntity<Waybill> getWaybill(@PathVariable Long shipmentId) {
        Shipment shipment = shipmentService.getShipmentById(shipmentId).orElse(null);
        if (shipment == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(documentService.generateWaybill(shipment));
    }
}
