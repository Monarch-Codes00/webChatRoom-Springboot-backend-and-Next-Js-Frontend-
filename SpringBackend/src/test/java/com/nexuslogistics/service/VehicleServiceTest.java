package com.nexuslogistics.service;

import com.nexuslogistics.dto.VehicleDTO;
import com.nexuslogistics.model.Vehicle;
import com.nexuslogistics.repository.VehicleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class VehicleServiceTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @InjectMocks
    private VehicleService vehicleService;

    @Test
    public void testGetVehicleById() {
        Vehicle vehicle = Vehicle.builder()
                .id(1L)
                .vId("VN-101")
                .name("Test Truck")
                .build();

        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle));

        Optional<VehicleDTO> result = vehicleService.getVehicleById(1L);

        assertTrue(result.isPresent());
        assertEquals("VN-101", result.get().getVId());
    }
}
