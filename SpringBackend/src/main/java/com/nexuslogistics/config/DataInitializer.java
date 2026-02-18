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
            PasswordEncoder encoder) {
        return args -> {
            if (userRepo.count() == 0) {
                System.out.println("Seeding default users...");
                userRepo.save(User.builder()
                        .username("admin")
                        .email("admin@nexus.com")
                        .password(encoder.encode("admin123"))
                        .role("ADMIN")
                        .build());
                userRepo.save(User.builder()
                        .username("driver")
                        .email("driver@nexus.com")
                        .password(encoder.encode("driver123"))
                        .role("DRIVER")
                        .build());
                userRepo.save(User.builder()
                        .username("warehouse")
                        .email("warehouse@nexus.com")
                        .password(encoder.encode("warehouse123"))
                        .role("WAREHOUSE")
                        .build());
            }

            if (vehicleRepo.count() == 0) {
                System.out.println("No data found. Seeding initial test data...");

                // Seed Vehicles
                Vehicle v1 = Vehicle.builder()
                        .vId("VN-101").plate("CA-7842-XL").name("Tesla Semi").driver("John Doe")
                        .latitude(37.7749).longitude(-122.4194).speed(65.0).fuel(78.5)
                        .mileage(12500.0).lastService("Feb 10, 2026").temp(4.2).status("IN_TRANSIT")
                        .build();

                Vehicle v2 = Vehicle.builder()
                        .vId("VN-102").plate("TX-9901-BA").name("Volvo FH16").driver("Jane Smith")
                        .latitude(34.0522).longitude(-118.2437).speed(55.0).fuel(45.0)
                        .mileage(8900.5).lastService("Jan 22, 2026").temp(-18.5).status("IDLE")
                        .build();

                Vehicle v3 = Vehicle.builder()
                        .vId("VN-103").plate("NY-4423-CC").name("Freightliner Cascadia").driver("Mike Ross")
                        .latitude(40.7128).longitude(-74.0060).speed(0.0).fuel(91.0)
                        .mileage(4500.0).lastService("Feb 05, 2026").temp(5.0).status("MAINTENANCE")
                        .build();

                vehicleRepo.saveAll(List.of(v1, v2, v3));

                // Seed Shipments
                Shipment s1 = Shipment.builder()
                        .sId("SH-9001").customer("Global Corp").recipientName("Chris Obi")
                        .origin("San Francisco, CA").destination("New York, NY").destinationAddress("123 Tech Lane, NY")
                        .weight("2,400 kg").status("IN_TRANSIT").latitude(40.7589).longitude(-73.9851)
                        .estimatedDeliveryTime(LocalDateTime.now().plusHours(4))
                        .created(LocalDateTime.now())
                        .assignedVehicle(v1)
                        .build();

                Shipment s2 = Shipment.builder()
                        .sId("SH-9002").customer("NextGen Logistics").recipientName("Sarah Connor")
                        .origin("Austin, TX").destination("Los Angeles, CA").destinationAddress("456 Cyber St, LA")
                        .weight("1,800 kg").status("PENDING").latitude(34.0522).longitude(-118.2437)
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
                scoreRepo.save(DriverScore.builder().driverName("John Doe").safetyScore(92).ecoScore(88).totalFuelSaved(120.5).rank(5).build());
                scoreRepo.save(DriverScore.builder().driverName("Jane Smith").safetyScore(85).ecoScore(95).totalFuelSaved(45.2).rank(2).build());

                System.out.println("Test data seeding completed.");
            }
        };
    }
}
