package com.bajonconsulting.Bajon_audit_App;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
@SpringBootApplication
@EnableConfigurationProperties(SupabaseProperties.class)
public class BajonAuditAppApplication implements CommandLineRunner {

	@Autowired
	public static void main(String[] args) {
		SpringApplication.run(BajonAuditAppApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {

	}

}
