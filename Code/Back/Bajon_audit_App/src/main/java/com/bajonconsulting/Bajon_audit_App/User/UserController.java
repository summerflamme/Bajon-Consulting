package com.bajonconsulting.Bajon_audit_App.User;


import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.bajonconsulting.Bajon_audit_App.SupabaseConfig;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final SupabaseConfig supabaseConfig;
    private final RestTemplate restTemplate = new RestTemplate();

    public UserController(SupabaseConfig supabaseConfig) {
        this.supabaseConfig = supabaseConfig;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createUser(@RequestBody Map<String, Object> body) {
        String url = supabaseConfig.getUrl() + "/auth/v1/admin/users";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + supabaseConfig.getServiceRoleKey());
        headers.set("apikey", supabaseConfig.getServiceRoleKey());

        Map<String, Object> request = new HashMap<>();
        request.put("email", body.get("email"));
        request.put("password", body.get("password"));
        request.put("email_confirm", true);

        Map<String, Object> metadata = new HashMap<>();
        metadata.put("displayName", body.get("displayName"));
        metadata.put("phone", body.get("phone"));
        request.put("user_metadata", metadata);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ResponseEntity<String> response =
                restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }
}
