package com.nexuslogistics.config;

import com.nexuslogistics.model.Vehicle;
import com.nexuslogistics.model.Shipment;
import com.nexuslogistics.model.LoadingDock;
import com.nexuslogistics.model.DriverScore;
import com.nexuslogistics.model.User;
import com.nexuslogistics.repository.UserRepository;
import com.nexuslogistics.repository.VehicleRepository;
import com.nexuslogistics.repository.ShipmentRepository;
import com.nexuslogistics.repository.LoadingDockRepository;
import com.nexuslogistics.repository.DriverScoreRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
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
            DriverScoreRepository scoreRepo,
            UserRepository userRepo,
            com.nexuslogistics.repository.DriverProfileRepository driverProfileRepo,
            PasswordEncoder encoder) {
        return args -> {
            if (userRepo.count() == 0) {
                System.out.println("Seeding default users and profiles...");
                
                // Seed Users
                User admin = User.builder()
                        .username("admin")
                        .email("admin@nexus.com")
                        .password(encoder.encode("admin123"))
                        .role(com.nexuslogistics.model.ERole.ROLE_ADMIN)
                        .build();
                userRepo.save(admin);

                User driverUser = User.builder()
                        .username("driver")
                        .email("driver@nexus.com")
                        .password(encoder.encode("driver123"))
                        .role(com.nexuslogistics.model.ERole.ROLE_DRIVER)
                        .build();
                userRepo.save(driverUser);

                User warehouse = User.builder()
                        .username("warehouse")
                        .email("warehouse@nexus.com")
                        .password(encoder.encode("warehouse123"))
                        .role(com.nexuslogistics.model.ERole.ROLE_DISPATCHER)
                        .build();
                userRepo.save(warehouse);

                // Seed Driver Profile
                com.nexuslogistics.model.DriverProfile profile = com.nexuslogistics.model.DriverProfile.builder()
                        .user(driverUser)
                        .licenseNumber("DL-12345678")
                        .phoneNumber("+1-555-0199")
                        .status("ACTIVE")
                        .rating(4.8)
                        .totalTrips(150)
                        .build();
                driverProfileRepo.save(profile);

                // Seed Vehicles
                Vehicle v1 = Vehicle.builder()
                        .vId("VN-101").plate("CA-7842-XL").name("Tesla Semi").driver(profile)
                        .latitude(37.7749).longitude(-122.4194).speed(65.0).fuel(78.5)
                        .mileage(12500.0).lastService("Feb 10, 2026").temp(4.2).status("IN_TRANSIT")
                        .maxCapacity(25000.0)
                        .build();

                Vehicle v2 = Vehicle.builder()
                        .vId("VN-102").plate("TX-9901-BA").name("Volvo FH16")
                        .latitude(34.0522).longitude(-118.2437).speed(55.0).fuel(45.0)
                        .mileage(8900.5).lastService("Jan 22, 2026").temp(-18.5).status("IDLE")
                        .maxCapacity(35000.0)
                        .build();

                vehicleRepo.saveAll(List.of(v1, v2));

                // Seed Shipments
                Shipment s1 = Shipment.builder()
                        .sId("SH-9001").customer("Global Corp").recipientName("Chris Obi")
                        .origin("San Francisco, CA").destination("New York, NY").destinationAddress("123 Tech Lane, NY")
                        .weightKg(2400.0).status("IN_TRANSIT").latitude(40.7589).longitude(-73.9851)
                        .estimatedDeliveryTime(LocalDateTime.now().plusHours(4))
                        .created(LocalDateTime.now())
                        .assignedVehicle(v1)
                        .build();

                Shipment s2 = Shipment.builder()
                        .sId("SH-9002").customer("NextGen Logistics").recipientName("Sarah Connor")
                        .origin("Austin, TX").destination("Los Angeles, CA").destinationAddress("456 Cyber St, LA")
                        .weightKg(1800.0).status("PENDING").latitude(34.0522).longitude(-118.2437)
                        .estimatedDeliveryTime(LocalDateTime.now().plusDays(1))
                        .created(LocalDateTime.now())
                        .assignedVehicle(v2)
                        .build();

                shipmentRepo.saveAll(List.of(s1, s2));

                // Seed Loading Docks
                LoadingDock d1 = LoadingDock.builder()
                        .dockNumber("DOCK-A1").dockType("Cold Storage").status("OCCUPIED")
                        .assignedVId("VN-101").currentActivity("Unloading Electronics").estimatedTurnaroundTime(15)
                        .build();

                LoadingDock d2 = LoadingDock.builder()
                        .dockNumber("DOCK-B2").dockType("Standard Express").status("AVAILABLE")
                        .currentActivity("Waiting for arrival").estimatedTurnaroundTime(0)
                        .build();

                dockRepo.saveAll(List.of(d1, d2));

                // Seed Driver Scores
                scoreRepo.save(com.nexuslogistics.model.DriverScore.builder().driver(profile).safetyScore(92).ecoScore(88).totalFuelSaved(120.5).rank(5).build());

                System.out.println("Industry-level test data seeding completed.");
            }
        };
    }
}
