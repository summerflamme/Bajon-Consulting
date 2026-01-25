package com.bajonconsulting.Bajon_audit_App.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;



/**
 * Configuration de la sécurité Spring pour l'application Bajon Audit.
 * Cette classe configure les règles de sécurité HTTP et l'accès aux endpoints.
 *
 * @author Bajon Consulting
 * @version 1.0
 */
@Configuration
public class SecurityConfig {
    /**
     * Configure la chaîne de filtres de sécurité pour l'application.
     * <p>
     * Cette configuration :
     * <ul>
     *   <li>Désactive la protection CSRF (Cross-Site Request Forgery)</li>
     *   <li>Autorise toutes les requêtes HTTP sans authentification</li>
     * </ul>
     *
     * @param http l'objet {@link HttpSecurity} permettant de configurer la sécurité web
     * @return la chaîne de filtres de sécurité configurée
     * @throws Exception si une erreur survient lors de la configuration
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                );
        return http.build();
    }
}

