package com.bajonconsulting.Bajon_audit_App.Users;

import java.util.HashMap;
import java.util.Map;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.bajonconsulting.Bajon_audit_App.SupabaseProperties;

import reactor.core.publisher.Mono;

@Service
public class SupabaseUsersService {

    private final SupabaseProperties supabaseProperties;
    private final WebClient webClient;

    public SupabaseUsersService(SupabaseProperties supabaseProperties, WebClient.Builder webClientBuilder) {
        this.supabaseProperties = supabaseProperties;
        this.webClient = webClientBuilder
                .baseUrl(supabaseProperties.getUrl() + "auth/v1")
                .defaultHeader("apikey", supabaseProperties.getServiceRoleKey())
                .defaultHeader("Authorization", "Bearer " + supabaseProperties.getServiceRoleKey())
                .build();
    }


    public Mono<Map<String, Object>> createUser(String email, String password, String firstName, String lastName, String phone, String currentRole) {
        Map<String, Object> body = new HashMap<>();
        body.put("email", email);
        body.put("password", password);
        body.put("email_confirm", true);

        Map<String, Object> userMetadata = new HashMap<>();
        userMetadata.put("email", email);
        userMetadata.put("lastName", lastName);
        userMetadata.put("firstName", firstName);
        userMetadata.put("phone", phone);
        userMetadata.put("role", currentRole);
        userMetadata.put("displayName", firstName + " " + lastName);

        body.put("user_metadata", userMetadata);
        return webClient.post()
                .uri("/admin/users")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .onErrorResume(WebClientResponseException.class, e -> {
                    System.err.println("Erreur Supabase: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
                    return Mono.error(e);
                });
    }
}
