package com.bajonconsulting.Bajon_audit_App.Users;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.bajonconsulting.Bajon_audit_App.Types.User;
import com.bajonconsulting.Bajon_audit_App.Types.UserMetadata;
import com.bajonconsulting.Bajon_audit_App.Types.supabaseUsersResponse;

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

    private List<Map<String, Object>> users;

    public List<Map<String, Object>> getUsers() {
        return users;
    }

    public void setUsers(List<Map<String , Object>> users) {
        this.users = users;
    }

    public SupabaseUsersService(SupabaseProperties supabaseProperties, WebClient.Builder webClientBuilder) {
        this.supabaseProperties = supabaseProperties;
        this.webClient = webClientBuilder
                .baseUrl(supabaseProperties.getUrl() + "auth/v1/admin")
                .defaultHeader("apikey", supabaseProperties.getServiceRoleKey())
                .defaultHeader("Authorization", "Bearer " + supabaseProperties.getServiceRoleKey())
                .build();
    }


    // Requête Post

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
                .uri("/users")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .onErrorResume(WebClientResponseException.class, e -> {
                    System.err.println("Erreur Supabase: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
                    return Mono.error(e);
                });
    }

    public Mono<Map<String, Object>> updateUser(String id, String email,String firstName, String lastName, String phone, String currentRole) {
        Map<String, Object> body = new HashMap<>();
        body.put("email", email);
        body.put("email_confirm", true);

        Map<String, Object> userMetadata = new HashMap<>();
        userMetadata.put("email", email);
        userMetadata.put("lastName", lastName);
        userMetadata.put("firstName", firstName);
        userMetadata.put("phone", phone);
        userMetadata.put("role", currentRole);
        userMetadata.put("displayName", firstName + " " + lastName);

        body.put("user_metadata", userMetadata);
        return webClient.put()
                .uri("/users/{id}", id)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .onErrorResume(WebClientResponseException.class, e -> {
                    System.err.println("Erreur Supabase: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
                    return Mono.error(e);
                });
    }




// Requête Get

    public Mono<List<? extends Object>> getUserList (){
        return  webClient.get()
                .uri("/users/")
                .retrieve()
                .bodyToMono(supabaseUsersResponse.class)
                .map(response -> {
                    List<Map<String, Object>> userList = response.getUsers();
                    if (userList != null) {
                        return userList.stream()
                            .map(this::mapToUser)
                            .toList();  
                    }
                    return List.of();
                })
                .onErrorResume(WebClientResponseException.class, e -> {
                    System.err.println("Erreur supabase: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
                    return Mono.error(e);
                });
    }

    public Mono<User> getUserById(String id) {
        return webClient.get()
                .uri("/users/{id}", id)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .map(this::mapToUser)
                .onErrorResume(WebClientResponseException.class, e -> {
                    System.err.println("Erreur Supabase: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
                    return Mono.error(e);
                });
    }

// Requête delete 

public Mono<Void> deleteUser(String id){
    return webClient.delete()
            .uri("/users/{id}", id)
            .retrieve()
            .bodyToMono(Void.class)
            .onErrorResume(WebClientResponseException.class, e -> {
                System.err.println("Erreur Supabase: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
                return Mono.error(e);
            });
}


    //==================================================================

    private User mapToUser(Map<String, Object> userMap) {
        User user = new User();
        user.setUID((String) userMap.get("id"));
        user.setEmail((String) userMap.get("email"));
        user.setCreatedAt((String) userMap.get("created_at"));
        user.setLastSignInAt((String) userMap.get("last_sign_in_at"));

        Map<String, Object> metada = (Map<String, Object>) userMap.get("user_metadata");
        if (metada != null) {
            UserMetadata userMetadata = new UserMetadata();
            userMetadata.setDisplayName((String) metada.get("displayName"));
            userMetadata.setFirstName((String)  metada.get("firstName"));
            userMetadata.setLastName((String) metada.get("lastName"));
            userMetadata.setPhone((String) metada.get("phone"));
            userMetadata.setRole((String) metada.get("role"));
            user.setUserMetadata(userMetadata);
        }

        return user;
    }
}
