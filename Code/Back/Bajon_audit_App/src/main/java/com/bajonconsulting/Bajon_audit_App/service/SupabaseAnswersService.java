package com.bajonconsulting.Bajon_audit_App.service;

import com.bajonconsulting.Bajon_audit_App.types.SupabaseProperties;
import com.bajonconsulting.Bajon_audit_App.types.AuditAnswerDto;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

/**
 * Service de récupération des réponses d'audit depuis Supabase.
 * <p>
 * Cette classe utilise un {@link WebClient} configuré pour interroger l'API REST de Supabase
 * et récupérer les réponses d'audit depuis la vue `vw_audit_questions_answers`. Elle gère
 * l'authentification via l'apikey et le token Bearer fournis par {@link SupabaseProperties}.
 * <p>
 * La classe est annotée {@code @Service} pour être gérée par le conteneur Spring.
 *
 * @author Bajon Consulting
 * @version 1.0
 * @see com.bajonconsulting.Bajon_audit_App.types.SupabaseProperties
 * @see com.bajonconsulting.Bajon_audit_App.types.AuditAnswerDto
 */
@Service
public class SupabaseAnswersService {

    /**
     * Client HTTP configuré pour interroger l'API REST de Supabase.
     * <p>
     * Ce client est initialisé avec l'URL de base, l'apikey et le token d'autorisation
     * nécessaires pour accéder aux données d'audit.
     */
    private WebClient webClient;

    /**
     * Construit une instance du service avec les dépendances requises.
     * <p>
     * Configure le {@link WebClient} avec l'URL de base de Supabase et les en-têtes
     * d'authentification (apikey et Authorization Bearer).
     *
     * @param supabaseProperties les propriétés de configuration Supabase (URL, clés d'API)
     * @param webClientBuilder le builder Spring pour créer le WebClient
     */
    public SupabaseAnswersService(SupabaseProperties supabaseProperties, WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .baseUrl(supabaseProperties.getUrl() + "rest/v1")
                .defaultHeader("apikey", supabaseProperties.getServiceRoleKey())
                .defaultHeader("Authorization", "Bearer " + supabaseProperties.getServiceRoleKey())
                .build();
    }

    /**
     * Récupère les réponses d'un audit depuis Supabase.
     * <p>
     * Interroge la vue `vw_audit_questions_answers` en filtrant par identifiant d'audit
     * et retourne la liste des réponses sous forme de {@link AuditAnswerDto}.
     * <p>
     * La requête est effectuée de manière réactive via {@link WebClient} et retourne
     * un {@link Mono} contenant la liste complète des réponses.
     *
     * @param auditId l'identifiant de l'audit pour lequel récupérer les réponses
     * @return un {@link Mono} contenant la liste des réponses d'audit
     */
    public Mono<List<AuditAnswerDto>> getAuditAnswers(int auditId) {
        return webClient
                .get()
                .uri(uriBuilder -> uriBuilder
                        .path("/vw_audit_questions_answers")
                        .queryParam("select", "*")
                        .queryParam("idaudit", "eq." + auditId)
                        .build()
                )
                .retrieve()
                .bodyToFlux(AuditAnswerDto.class)
                .collectList();
    }
}
