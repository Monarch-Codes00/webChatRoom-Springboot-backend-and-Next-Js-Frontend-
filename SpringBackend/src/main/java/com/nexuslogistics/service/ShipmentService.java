package com.nexuslogistics.service;

import com.nexuslogistics.model.Shipment;
import com.nexuslogistics.repository.ShipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShipmentService {

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private NotificationService notificationService;

    public List<Shipment> getAllShipments() {
        return shipmentRepository.findAll();
    }

    public List<Shipment> getShipmentsByStatus(String status) {
        return shipmentRepository.findByStatus(status);
    }

    public Optional<Shipment> getShipmentById(Long id) {
        return shipmentRepository.findById(id);
    }

    public Shipment saveShipment(Shipment shipment) {
        return shipmentRepository.save(shipment);
    }

    public void updateStatus(Long id, String status) {
        shipmentRepository.findById(id).ifPresent(shipment -> {
            shipment.setStatus(status);
            shipmentRepository.save(shipment);
            notificationService.sendTrackingUpdate(shipment);
        });
    }

    public List<Shipment> getShipmentsByVehicle(Long vehicleId) {
        return shipmentRepository.findByAssignedVehicleId(vehicleId);
    }
}
