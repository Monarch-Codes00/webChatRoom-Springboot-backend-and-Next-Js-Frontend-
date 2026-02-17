package com.nexuslogistics.controller;

import com.nexuslogistics.model.Vehicle;
import com.nexuslogistics.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class TelemetryController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private VehicleService vehicleService;

    // This endpoint can be used by mobile apps/IoT trackers to push GPS data
    @PostMapping("/api/telemetry/update")
    public void receiveTelemetry(@RequestBody Vehicle vehicleUpdate) {
        // 1. Update the database
        vehicleService.updateVehicleLocation(
            vehicleUpdate.getId(), 
            vehicleUpdate.getLatitude(), 
            vehicleUpdate.getLongitude(), 
            vehicleUpdate.getSpeed()
        );

        // 2. Broadcast the update to all connected frontend clients via WebSockets
        messagingTemplate.convertAndSend("/topic/fleet", vehicleUpdate);
        
        System.out.println("Broadcasted telemetry for vehicle: " + vehicleUpdate.getVehicleNumber());
    }
}
