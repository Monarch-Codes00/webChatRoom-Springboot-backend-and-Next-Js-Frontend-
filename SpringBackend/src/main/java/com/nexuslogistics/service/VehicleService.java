package com.nexuslogistics.service;

import com.nexuslogistics.dto.VehicleDTO;
import com.nexuslogistics.model.Vehicle;
import com.nexuslogistics.repository.DriverProfileRepository;
import com.nexuslogistics.repository.UserRepository;
import com.nexuslogistics.repository.VehicleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DriverProfileRepository driverProfileRepository;

    public List<VehicleDTO> getAllVehicles() {
        return vehicleRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<VehicleDTO> getVehicleById(Long id) {
        return vehicleRepository.findById(id).map(this::convertToDTO);
    }

    public VehicleDTO saveVehicle(VehicleDTO dto) {
        log.info("Saving vehicle: {}", dto.getVId());
        Vehicle entity = convertToEntity(dto);
        return convertToDTO(vehicleRepository.save(entity));
    }

    public void deleteVehicle(Long id) {
        log.warn("Deleting vehicle with ID: {}", id);
        vehicleRepository.deleteById(id);
    }

    public VehicleDTO updateVehicleLocation(Long id, double latitude, double longitude, double speed) {
        return vehicleRepository.findById(id).map(vehicle -> {
            vehicle.setLatitude(latitude);
            vehicle.setLongitude(longitude);
            vehicle.setSpeed(speed);
            return convertToDTO(vehicleRepository.save(vehicle));
        }).orElse(null);
    }

    // Manual mapping for now - would ideally use MapStruct in a larger project
    private VehicleDTO convertToDTO(Vehicle entity) {
        return VehicleDTO.builder()
                .id(entity.getId())
                .vId(entity.getVId())
                .plate(entity.getPlate())
                .name(entity.getName())
                .driver(entity.getDriver() != null ? entity.getDriver().getUser().getUsername() : "Unassigned")
                .latitude(entity.getLatitude())
                .longitude(entity.getLongitude())
                .speed(entity.getSpeed())
                .fuel(entity.getFuel())
                .mileage(entity.getMileage())
                .lastService(entity.getLastService())
                .temp(entity.getTemp())
                .status(entity.getStatus())
                .build();
    }

    private Vehicle convertToEntity(VehicleDTO dto) {
        Vehicle entity = new Vehicle();
        if (dto.getId() != null) entity.setId(dto.getId());
        entity.setVId(dto.getVId());
        entity.setPlate(dto.getPlate());
        entity.setName(dto.getName());
        if (dto.getDriver() != null) {
            userRepository.findByUsername(dto.getDriver()).ifPresent(user -> {
                driverProfileRepository.findByUserId(user.getId()).ifPresent(entity::setDriver);
            });
        }
        entity.setLatitude(dto.getLatitude());
        entity.setLongitude(dto.getLongitude());
        entity.setSpeed(dto.getSpeed());
        entity.setFuel(dto.getFuel());
        entity.setMileage(dto.getMileage());
        entity.setLastService(dto.getLastService());
        entity.setTemp(dto.getTemp());
        entity.setStatus(dto.getStatus());
        return entity;
    }
}
