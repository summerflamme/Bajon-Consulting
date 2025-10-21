package com.bajonconsulting.Bajon_audit_App;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.bajonconsulting.Bajon_audit_App.Users.SupabaseUsersService;

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
	private SupabaseUsersService supabaseUsersService;
	public static void main(String[] args) {
		SpringApplication.run(BajonAuditAppApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {

	}

}
