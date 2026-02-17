package com.nexuslogistics.service;

import com.nexuslogistics.model.Vehicle;
import com.nexuslogistics.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class FleetSimulationService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private final Random random = new Random();

    /**
     * Every 5 seconds, simulate vehicle movement for all "IN_TRANSIT" vehicles
     * and broadcast the update via WebSockets.
     */
    @Scheduled(fixedRate = 5000)
    public void simulateMovement() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        
        for (Vehicle vehicle : vehicles) {
            if ("IN_TRANSIT".equals(vehicle.getStatus())) {
                // Slight movement (approx 0.001 - 0.005 degrees)
                double latDelta = (random.nextDouble() - 0.5) * 0.002;
                double lngDelta = (random.nextDouble() - 0.5) * 0.002;
                
                vehicle.setLatitude(vehicle.getLatitude() + latDelta);
                vehicle.setLongitude(vehicle.getLongitude() + lngDelta);
                
                // Slightly fluctuate speed
                double speedDelta = (random.nextDouble() - 0.5) * 5;
                vehicle.setSpeed(Math.max(40, Math.min(80, vehicle.getSpeed() + speedDelta)));
                
                vehicleRepository.save(vehicle);
                
                // Broadcast to WebSockets
                messagingTemplate.convertAndSend("/topic/fleet", vehicle);
            }
        }
    }
}
