package com.bajonconsulting.Bajon_audit_App.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;



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
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                );
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://127.0.0.1:5173"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
