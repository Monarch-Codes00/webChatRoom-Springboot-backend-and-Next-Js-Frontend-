package com.nexuslogistics.service;

import com.nexuslogistics.dto.ShipmentDTO;
import com.nexuslogistics.model.Shipment;
import com.nexuslogistics.model.Vehicle;
import com.nexuslogistics.repository.ShipmentRepository;
import com.nexuslogistics.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ShipmentService {

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private NotificationService notificationService;

    public List<ShipmentDTO> getAllShipments() {
        return shipmentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ShipmentDTO> getShipmentsByStatus(String status) {
        return shipmentRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<ShipmentDTO> getShipmentById(Long id) {
        return shipmentRepository.findById(id).map(this::convertToDTO);
    }

    public ShipmentDTO saveShipment(ShipmentDTO dto) {
        Shipment entity = convertToEntity(dto);
        if (dto.getAssignedVehicleId() != null) {
            vehicleRepository.findById(dto.getAssignedVehicleId()).ifPresent(entity::setAssignedVehicle);
        }
        return convertToDTO(shipmentRepository.save(entity));
    }

    public void updateStatus(Long id, String status) {
        shipmentRepository.findById(id).ifPresent(shipment -> {
            shipment.setStatus(status);
            shipmentRepository.save(shipment);
            notificationService.sendTrackingUpdate(shipment);
        });
    }

    public void deleteShipment(Long id) {
        shipmentRepository.deleteById(id);
    }

    public List<ShipmentDTO> getShipmentsByVehicle(Long vehicleId) {
        return shipmentRepository.findByAssignedVehicleId(vehicleId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ShipmentDTO convertToDTO(Shipment entity) {
        return ShipmentDTO.builder()
                .id(entity.getId())
                .sId(entity.getSId())
                .customer(entity.getCustomer())
                .recipientName(entity.getRecipientName())
                .origin(entity.getOrigin())
                .destination(entity.getDestination())
                .destinationAddress(entity.getDestinationAddress())
                .weight(entity.getWeight())
                .status(entity.getStatus())
                .latitude(entity.getLatitude())
                .longitude(entity.getLongitude())
                .estimatedDeliveryTime(entity.getEstimatedDeliveryTime())
                .created(entity.getCreated())
                .assignedVehicleId(entity.getAssignedVehicle() != null ? entity.getAssignedVehicle().getId() : null)
                .build();
    }

    private Shipment convertToEntity(ShipmentDTO dto) {
        Shipment entity = new Shipment();
        if (dto.getId() != null) entity.setId(dto.getId());
        entity.setSId(dto.getSId());
        entity.setCustomer(dto.getCustomer());
        entity.setRecipientName(dto.getRecipientName());
        entity.setOrigin(dto.getOrigin());
        entity.setDestination(dto.getDestination());
        entity.setDestinationAddress(dto.getDestinationAddress());
        entity.setWeight(dto.getWeight());
        entity.setStatus(dto.getStatus());
        entity.setLatitude(dto.getLatitude());
        entity.setLongitude(dto.getLongitude());
        entity.setEstimatedDeliveryTime(dto.getEstimatedDeliveryTime());
        entity.setCreated(dto.getCreated());
        return entity;
    }
}
