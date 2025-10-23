package com.bajonconsulting.Bajon_audit_App.Users;

import com.bajonconsulting.Bajon_audit_App.Types.User;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;




@CrossOrigin(origins = "http://localhost:5173/")
@RestController
@RequestMapping("/api/users")
public class UsersRestController {
    private final SupabaseUsersService supabaseUsersService;
    private final Environment environment;

    public UsersRestController(SupabaseUsersService supabaseUsersService, Environment environment) {
        this.supabaseUsersService = supabaseUsersService;
        this.environment = environment;
    }

    // Requête Post

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
    



    // Requête Get

    @GetMapping("/listUsers")
    public Mono<List<? extends Object>> getUserList(){
        return supabaseUsersService.getUserList();
    }

    @GetMapping("/{id}")
    public Mono<User> getUserById(@PathVariable String id) {
        return supabaseUsersService.getUserById(id);
    }
    

    //Requête DELETE

    @DeleteMapping("deleteUser/{id}")
    public Mono<Void> deleteUser(@PathVariable String id) {
        return supabaseUsersService.deleteUser(id);
    }
}