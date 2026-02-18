package com.nexuslogistics.service;

import com.nexuslogistics.model.Shipment;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@Slf4j
public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendTrackingUpdate(Shipment shipment) {
        String message = String.format(
            "NexusLogistics Update: Your shipment %s is now %s.",
            shipment.getSId(),
            shipment.getStatus()
        );
        
        log.info("Broadcasting shipment update: {}", message);
        
        Map<String, Object> payload = Map.of(
            "shipmentId", shipment.getSId(),
            "status", shipment.getStatus(),
            "message", message,
            "timestamp", LocalDateTime.now()
        );
        
        // Real-time broadcast via WebSockets
        messagingTemplate.convertAndSend("/topic/shipments", payload);
        
        // Simulating other channels (Industry Level usually has real integrations here)
        log.info("[SMS/EMAIL SYNC] Notified {} about shipment {}", shipment.getRecipientName(), shipment.getSId());
    }
}
