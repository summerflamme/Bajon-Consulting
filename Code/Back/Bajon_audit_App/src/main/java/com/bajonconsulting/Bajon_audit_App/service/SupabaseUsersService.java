package com.bajonconsulting.Bajon_audit_App.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.bajonconsulting.Bajon_audit_App.types.UserDTO;
import com.bajonconsulting.Bajon_audit_App.types.UserMetadataDTO;
import com.bajonconsulting.Bajon_audit_App.types.supabaseUsersResponse;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.bajonconsulting.Bajon_audit_App.types.SupabaseProperties;

import reactor.core.publisher.Mono;


/**
 * Service de gestion des utilisateurs Supabase.
 * <p>
 * Cette classe utilise un {@link WebClient} configuré pour interagir avec l'API d'administration
 * Supabase (Auth API) et effectuer des opérations CRUD sur les utilisateurs. Elle gère
 * l'authentification via l'apikey et le token Bearer fournis par {@link SupabaseProperties}.
 * <p>
 * La classe est annotée {@code @Service} pour être gérée par le conteneur Spring.
 *
 * @author Bajon Consulting
 * @version 1.0
 * @see com.bajonconsulting.Bajon_audit_App.types.SupabaseProperties
 * @see com.bajonconsulting.Bajon_audit_App.types.UserDTO
 */
@Service
public class SupabaseUsersService {
    /**
     * Client HTTP configuré pour interroger l'API d'administration Supabase.
     * <p>
     * Ce client est initialisé avec l'URL de base, l'apikey et le token d'autorisation
     * nécessaires pour accéder à l'API Auth de Supabase.
     */
    private final WebClient webClient;


    /**
     * Construit une instance du service avec les dépendances requises.
     * <p>
     * Configure le {@link WebClient} avec l'URL de base de l'API d'administration Supabase
     * et les en-têtes d'authentification (apikey et Authorization Bearer).
     *
     * @param supabaseProperties les propriétés de configuration Supabase (URL, clés d'API)
     * @param webClientBuilder le builder Spring pour créer le WebClient
     */
    public SupabaseUsersService(SupabaseProperties supabaseProperties, WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .baseUrl(supabaseProperties.getUrl() + "auth/v1/admin")
                .defaultHeader("apikey", supabaseProperties.getServiceRoleKey())
                .defaultHeader("Authorization", "Bearer " + supabaseProperties.getServiceRoleKey())
                .build();
    }




    /**
     * Crée un nouvel utilisateur dans Supabase.
     * <p>
     * Envoie une requête POST à l'API d'administration pour créer un utilisateur avec
     * les informations fournies. Les métadonnées utilisateur incluent le prénom, nom,
     * téléphone et rôle.
     * <p>
     * La requête est effectuée de manière réactive via {@link WebClient} et retourne
     * un {@link Mono} contenant les données de l'utilisateur créé.
     *
     * @param email l'adresse email de l'utilisateur
     * @param password le mot de passe de l'utilisateur
     * @param firstName le prénom de l'utilisateur
     * @param lastName le nom de famille de l'utilisateur
     * @param phone le numéro de téléphone de l'utilisateur
     * @param currentRole le rôle attribué à l'utilisateur
     * @return un {@link Mono} contenant les données de l'utilisateur créé sous forme de Map
     */
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

    /**
     * Met à jour les informations d'un utilisateur existant dans Supabase.
     * <p>
     * Envoie une requête PUT à l'API d'administration pour modifier les données d'un
     * utilisateur identifié par son ID. Les métadonnées utilisateur sont également
     * mises à jour.
     * <p>
     * La requête est effectuée de manière réactive via {@link WebClient} et retourne
     * un {@link Mono} contenant les données de l'utilisateur mis à jour.
     *
     * @param id l'identifiant unique de l'utilisateur à mettre à jour
     * @param email la nouvelle adresse email
     * @param firstName le nouveau prénom
     * @param lastName le nouveau nom de famille
     * @param phone le nouveau numéro de téléphone
     * @param currentRole le nouveau rôle
     * @return un {@link Mono} contenant les données de l'utilisateur mis à jour sous forme de Map
     */
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

    /**
     * Récupère la liste de tous les utilisateurs depuis Supabase.
     * <p>
     * Envoie une requête GET à l'API d'administration pour obtenir la liste complète
     * des utilisateurs. Les données brutes sont ensuite mappées en objets {@link UserDTO}.
     * <p>
     * La requête est effectuée de manière réactive via {@link WebClient} et retourne
     * un {@link Mono} contenant la liste des utilisateurs.
     *
     * @return un {@link Mono} contenant la liste de tous les utilisateurs
     */
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


    /**
     * Récupère un utilisateur spécifique par son identifiant depuis Supabase.
     * <p>
     * Envoie une requête GET à l'API d'administration pour obtenir les informations
     * d'un utilisateur identifié par son ID. Les données sont mappées en objet {@link UserDTO}.
     * <p>
     * La requête est effectuée de manière réactive via {@link WebClient} et retourne
     * un {@link Mono} contenant l'utilisateur demandé.
     *
     * @param id l'identifiant unique de l'utilisateur à récupérer
     * @return un {@link Mono} contenant l'utilisateur sous forme de {@link UserDTO}
     */
    public Mono<UserDTO> getUserById(String id) {
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

    /**
     * Supprime un utilisateur de Supabase.
     * <p>
     * Envoie une requête DELETE à l'API d'administration pour supprimer définitivement
     * un utilisateur identifié par son ID.
     * <p>
     * La requête est effectuée de manière réactive via {@link WebClient} et retourne
     * un {@link Mono} vide indiquant la complétion de l'opération.
     *
     * @param id l'identifiant unique de l'utilisateur à supprimer
     * @return un {@link Mono} vide indiquant la suppression réussie
     */
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

    /**
     * Convertit une Map représentant un utilisateur en objet {@link UserDTO}.
     * <p>
     * Méthode utilitaire privée qui mappe les données brutes retournées par l'API Supabase
     * vers un objet structuré {@link UserDTO}, incluant les métadonnées utilisateur
     * (prénom, nom, téléphone, rôle, etc.).
     *
     * @param userMap la Map contenant les données brutes de l'utilisateur
     * @return un {@link UserDTO} avec les données mappées
     */
    private UserDTO mapToUser(Map<String, Object> userMap) {
        UserDTO user = new UserDTO();
        user.setUID((String) userMap.get("id"));
        user.setEmail((String) userMap.get("email"));
        user.setCreatedAt((String) userMap.get("created_at"));
        user.setLastSignInAt((String) userMap.get("last_sign_in_at"));

        Map<String, Object> metada = (Map<String, Object>) userMap.get("user_metadata");
        if (metada != null) {
            UserMetadataDTO userMetadata = new UserMetadataDTO();
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
