package com.nexuslogistics.service;

import com.nexuslogistics.model.Shipment;
import com.nexuslogistics.model.Waybill;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class DocumentService {

    public Waybill generateWaybill(Shipment shipment) {
        return Waybill.builder()
                .waybillNumber("WB-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .shipmentNumber(shipment.getSId())
                .senderName(shipment.getCustomer())
                .recipientName(shipment.getRecipientName())
                .originAddress("Nexus Hub Alpha") // Mock origin
                .destinationAddress(shipment.getDestinationAddress())
                .cargoDescription("Standard Freight")
                .weight(Double.parseDouble(shipment.getWeight().replaceAll("[^0-9.]", ""))) // Strip "kg" etc
                .dimensions("40x48x60 in")
                .issuedAt(LocalDateTime.now())
                .barcodeData("NEXUS-" + shipment.getSId())
                .build();
    }
}
