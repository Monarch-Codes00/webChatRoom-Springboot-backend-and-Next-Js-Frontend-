package com.nexuslogistics;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@org.springframework.scheduling.annotation.EnableScheduling
public class NexusLogisticsApplication {

	public static void main(String[] args) {
		SpringApplication.run(NexusLogisticsApplication.class, args);
	}

}
