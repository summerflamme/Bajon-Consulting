package com.bajonconsulting.Bajon_audit_App.controller;

import com.bajonconsulting.Bajon_audit_App.types.UserDTO;
import com.bajonconsulting.Bajon_audit_App.service.SupabaseUsersService;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;



/**
 * Contrôleur REST pour la gestion des utilisateurs via Supabase.
 * <p>
 * Ce contrôleur expose des endpoints pour effectuer des opérations CRUD sur les utilisateurs :
 * création, lecture, mise à jour et suppression.
 * <p>
 * Utilise une approche réactive avec Project Reactor pour gérer les requêtes de manière asynchrone.
 *
 * @author Bajon Consulting
 * @version 1.0
 */
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173","http://localhost:8080"})
@RestController
@RequestMapping("/api/users")
public class UsersRestController {
    private final SupabaseUsersService supabaseUsersService;
    private final Environment environment;

    /**
     * Constructeur avec injection de dépendances.
     *
     * @param supabaseUsersService le service de gestion des utilisateurs Supabase
     * @param environment l'environnement Spring pour accéder aux propriétés de configuration
     */
    public UsersRestController(SupabaseUsersService supabaseUsersService, Environment environment) {
        this.supabaseUsersService = supabaseUsersService;
        this.environment = environment;
    }

    /**
     * Crée un nouvel utilisateur dans Supabase.
     * <p>
     * Endpoint accessible à : {@code POST /api/users/createUser}
     * <p>
     * Valide la présence de tous les champs requis avant de procéder à la création.
     * Route utilisée par le front React dans le fichier userForm.tsx.
     *
     * @param payload les données de l'utilisateur à créer contenant :
     *                <ul>
     *                  <li>email - l'adresse email de l'utilisateur</li>
     *                  <li>password - le mot de passe de l'utilisateur</li>
     *                  <li>lastName - le nom de famille</li>
     *                  <li>firstName - le prénom</li>
     *                  <li>currentRole - le rôle actuel de l'utilisateur</li>
     *                  <li>phone - le numéro de téléphone</li>
     *                </ul>
     * @return un {@link Mono} contenant la réponse avec les détails de l'utilisateur créé ou un message d'erreur
     */
    @PostMapping("/createUser")
    public Mono<ResponseEntity<Map<String, Object>>> createUser(@RequestBody Map<String, Object> payload) {
        String email = (String) payload.get("email");
        String password = (String) payload.get("password");
        String lastName = (String) payload.get("lastName");
        String firstName = (String) payload.get("firstName");
        String currentRole = (String) payload.get("currentRole");
        String phone = (String) payload.get("phone");

        if (email == null || password == null || lastName == null || firstName == null || currentRole == null || phone == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", 400);
            response.put("error", "Champs requis manquants");
            ResponseEntity<Map<String, Object>> respBad = ResponseEntity.badRequest().body(response);
            System.out.println("Response (bad request) status: " + respBad.getStatusCodeValue() + " body: " + respBad.getBody());
            return Mono.just(respBad);
        }

        System.out.println("Serveur état : Running, port=" + environment.getProperty("local.server.port"));
        return supabaseUsersService.createUser(email, password, lastName, firstName, phone, currentRole)
                .map(result -> {
                    ResponseEntity<Map<String, Object>> resp = ResponseEntity.ok(result);
                    System.out.println("Response (success) status: " + resp.getStatusCodeValue() + " body: " + resp.getBody());
                    return resp;
                })
                .onErrorResume(ex -> {
                    Map<String, Object> err = new HashMap<>();
                    err.put("Error", ex.getMessage() != null ? ex.getMessage() : "Internal server error");
                    ResponseEntity<Map<String, Object>> respErr = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
                    System.out.println("Response (error) status: " + respErr.getStatusCodeValue() + " body: " + respErr.getBody());
                    return Mono.just(respErr);
                });
    }

    /**
     * Met à jour les informations d'un utilisateur existant.
     * <p>
     * Endpoint accessible à : {@code POST /api/users/updateUser/{id}}
     * <p>
     * Valide la présence de tous les champs requis avant de procéder à la mise à jour.
     * Route utilisée par le front React dans le fichier userForm.tsx.
     *
     * @param payload les données de l'utilisateur à mettre à jour contenant :
     *                <ul>
     *                  <li>id - l'identifiant unique de l'utilisateur</li>
     *                  <li>email - l'adresse email de l'utilisateur</li>
     *                  <li>lastName - le nom de famille</li>
     *                  <li>firstName - le prénom</li>
     *                  <li>currentRole - le rôle actuel de l'utilisateur</li>
     *                  <li>phone - le numéro de téléphone</li>
     *                </ul>
     * @return un {@link Mono} contenant la réponse avec les détails de l'utilisateur mis à jour ou un message d'erreur
     */
    @PostMapping("/updateUser/{id}")
    public Mono<ResponseEntity<Map<String, Object>>> updateUser(@RequestBody Map<String, Object> payload){
        String id = (String) payload.get("id");
        String email = (String) payload.get("email");
        String lastName = (String) payload.get("lastName");
        String firstName = (String) payload.get("firstName");
        String currentRole = (String) payload.get("currentRole");
        String phone = (String) payload.get("phone");

        if (id == null || email == null || lastName == null || firstName == null || currentRole == null || phone == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", 400);
            response.put("error", "Champs requis manquants");
            ResponseEntity<Map<String, Object>> respBad = ResponseEntity.badRequest().body(response);
            System.out.println("Response (bad request) status: " + respBad.getStatusCodeValue() + " body: " + respBad.getBody());
            return Mono.just(respBad);
        }

        return supabaseUsersService.updateUser(id, email, lastName, firstName, phone, currentRole)
                .map(result -> {
                    ResponseEntity<Map<String, Object>> resp = ResponseEntity.ok(result);
                    System.out.println("Response (success) status: " + resp.getStatusCodeValue() + " body: " + resp.getBody());
                    return resp;
                })
                .onErrorResume(e -> {
                    Map<String, Object> err = new HashMap<>();
                    err.put("Error", e.getMessage() != null ? e.getMessage() : "Internal server error");
                    ResponseEntity<Map<String, Object>> respErr = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
                    System.out.println("Response (error) status: " + respErr.getStatusCodeValue() + " body: " + respErr.getBody());
                    return Mono.just(respErr);
                });
    }





    /**
     * Récupère la liste complète de tous les utilisateurs.
     * <p>
     * Endpoint accessible à : {@code GET /api/users/listUsers}
     * <p>
     * Appelle l'API Supabase pour obtenir la liste des utilisateurs.
     * Route utilisée par le front React dans le fichier userForm.tsx.
     *
     * @return un {@link Mono} contenant la liste des utilisateurs
     */
    @GetMapping("/listUsers")
    public Mono<List<? extends Object>> getUserList(){
        return supabaseUsersService.getUserList();
    }


    /**
     * Récupère les détails d'un utilisateur spécifique par son identifiant.
     * <p>
     * Endpoint accessible à : {@code GET /api/users/{id}}
     * <p>
     * Route utilisée par le front React dans le fichier userForm.tsx.
     *
     * @param id l'identifiant unique de l'utilisateur à récupérer
     * @return un {@link Mono} contenant les données de l'utilisateur sous forme de {@link UserDTO}
     */
    @GetMapping("/{id}")
    public Mono<UserDTO> getUserById(@PathVariable String id) {
        return supabaseUsersService.getUserById(id);
    }

    //Requête DELETE


    /**
     * Supprime un utilisateur de Supabase.
     * <p>
     * Endpoint accessible à : {@code DELETE /api/users/deleteUser/{id}}
     * <p>
     * Route utilisée par le front React dans le fichier UserCard.tsx.
     *
     * @param id l'identifiant unique de l'utilisateur à supprimer
     * @return un {@link Mono} vide indiquant la fin de l'opération de suppression
     */
    @DeleteMapping("deleteUser/{id}")
    public Mono<Void> deleteUser(@PathVariable String id) {
        return supabaseUsersService.deleteUser(id);
    }
}
