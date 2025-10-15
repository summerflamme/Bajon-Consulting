package com.bajonconsulting.Bajon_audit_App;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.bajonconsulting.Bajon_audit_App.auth.SupabaseAuthService;

@SpringBootApplication
@EnableConfigurationProperties(SupabaseProperties.class)
public class BajonAuditAppApplication implements CommandLineRunner {
	
	Map<String, Object> meta = new HashMap<>() {{
	put("email", "testtest@gmail.com");
	put("phone", "0603029598");
	put("displayName", "User Test");
	put("email_verified", true);
	put("phone_verified", false);
	put("role", "admin");
	}};

	@Autowired
	private SupabaseAuthService supabaseAuthService;
	public static void main(String[] args) {
		SpringApplication.run(BajonAuditAppApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
	
	try {
            Map<String, Object> createdUser = supabaseAuthService
                    .createUser("UserBackEnd@email.com","password", "Back", "Test", meta)
                    .block(); // 

            System.out.println("Utilisateur créé : " + createdUser);
        } catch (Exception e) {
            e.printStackTrace();
        }
	}
	
}
