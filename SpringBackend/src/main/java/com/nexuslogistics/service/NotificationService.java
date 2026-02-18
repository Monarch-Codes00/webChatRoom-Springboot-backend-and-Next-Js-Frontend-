package com.nexuslogistics.service;

import com.nexuslogistics.model.Shipment;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    public void sendTrackingUpdate(Shipment shipment) {
        String message = String.format(
            "NexusLogistics Update: Your shipment %s is now %s. Track live: https://nexus-track.io/%s",
            shipment.getSId(),
            shipment.getStatus(),
            shipment.getSId()
        );
        
        // Simulating Multi-Channel Broadcast
        System.out.println("[SMS SENT] to " + shipment.getRecipientName() + ": " + message);
        System.out.println("[EMAIL SENT] to " + shipment.getRecipientName() + "@example.com: " + message);
        System.out.println("[WHATSAPP SENT] to " + shipment.getRecipientName() + ": " + message);
    }
}
