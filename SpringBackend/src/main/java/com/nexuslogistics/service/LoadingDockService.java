package com.nexuslogistics.service;

import com.nexuslogistics.model.LoadingDock;
import com.nexuslogistics.repository.LoadingDockRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class LoadingDockService {

    @Autowired
    private LoadingDockRepository dockRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public List<LoadingDock> getAllDocks() {
        return dockRepository.findAll();
    }

    public Optional<LoadingDock> assignVehicle(Long dockId, String vehicleId, String status) {
        log.info("Assigning vehicle {} to dock {} with status {}", vehicleId, dockId, status);
        
        return dockRepository.findById(dockId).map(dock -> {
            dock.setStatus(status);
            dock.setAssignedVId(vehicleId);
            if ("Occupied".equalsIgnoreCase(status)) {
                dock.setCurrentActivity("LOADING");
                dock.setEstimatedTurnaroundTime(30); // Default 30 mins
            } else {
                dock.setCurrentActivity("IDLE");
                dock.setEstimatedTurnaroundTime(0);
            }
            
            LoadingDock saved = dockRepository.save(dock);
            broadcastUpdate(saved);
            return saved;
        });
    }
    
    public Optional<LoadingDock> updateActivity(Long dockId, String activity, int turnaroundTime) {
        return dockRepository.findById(dockId).map(dock -> {
            dock.setCurrentActivity(activity);
            dock.setEstimatedTurnaroundTime(turnaroundTime);
            LoadingDock saved = dockRepository.save(dock);
            broadcastUpdate(saved);
            return saved;
        });
    }

    private void broadcastUpdate(LoadingDock dock) {
        messagingTemplate.convertAndSend("/topic/docks", dock);
    }
}
