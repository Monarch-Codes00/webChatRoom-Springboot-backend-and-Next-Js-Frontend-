package com.nexuslogistics.config;

import com.nexuslogistics.model.Vehicle;
import com.nexuslogistics.model.Shipment;
import com.nexuslogistics.model.LoadingDock;
import com.nexuslogistics.model.DriverScore;
import com.nexuslogistics.repository.VehicleRepository;
import com.nexuslogistics.repository.ShipmentRepository;
import com.nexuslogistics.repository.LoadingDockRepository;
import com.nexuslogistics.repository.DriverScoreRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(
            VehicleRepository vehicleRepo,
            ShipmentRepository shipmentRepo,
            LoadingDockRepository dockRepo,
            DriverScoreRepository scoreRepo) {
        return args -> {
            if (vehicleRepo.count() == 0) {
                System.out.println("No data found. Seeding initial test data...");

                // Seed Vehicles
                Vehicle v1 = new Vehicle(null, "VN-101", "Tesla Semi", "John Doe", 40.7128, -74.0060, 65.0, "IN_TRANSIT");
                Vehicle v2 = new Vehicle(null, "VN-102", "Volvo FH16", "Jane Smith", 34.0522, -118.2437, 55.0, "IDLE");
                Vehicle v3 = new Vehicle(null, "VN-103", "Freightliner Cascadia", "Mike Ross", 41.8781, -87.6298, 0.0, "MAINTENANCE");
                vehicleRepo.saveAll(List.of(v1, v2, v3));

                // Seed Shipments
                Shipment s1 = new Shipment(null, "SH-9001", "Global Corp", "Chris Obi", "123 Tech Lane, NY", "IN_TRANSIT", LocalDateTime.now().plusHours(4), v1);
                Shipment s2 = new Shipment(null, "SH-9002", "NextGen Logistics", "Sarah Connor", "456 Cyber St, LA", "PENDING", LocalDateTime.now().plusDays(1), v2);
                shipmentRepo.saveAll(List.of(s1, s2));

                // Seed Loading Docks
                LoadingDock d1 = new LoadingDock(null, "DOCK-A1", "OCCUPIED", "VN-101", "Unloading Electronics", 15);
                LoadingDock d2 = new LoadingDock(null, "DOCK-A2", "AVAILABLE", null, "Waiting for arrival", 0);
                dockRepo.saveAll(List.of(d1, d2));

                // Seed Driver Scores
                scoreRepo.save(new DriverScore(null, "John Doe", 92, 88, 5, 120.5));
                scoreRepo.save(new DriverScore(null, "Jane Smith", 85, 95, 2, 45.2));

                System.out.println("Test data seeding completed.");
            }
        };
    }
}
