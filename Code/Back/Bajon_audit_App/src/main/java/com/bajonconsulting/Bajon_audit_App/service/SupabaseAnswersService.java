package com.bajonconsulting.Bajon_audit_App.service;

import com.bajonconsulting.Bajon_audit_App.types.SupabaseProperties;
import com.bajonconsulting.Bajon_audit_App.types.AuditAnswerDto;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class SupabaseAnswersService {

    private WebClient webClient;
    
    public SupabaseAnswersService(SupabaseProperties supabaseProperties, WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .baseUrl(supabaseProperties.getUrl() + "rest/v1")
                .defaultHeader("apikey", supabaseProperties.getServiceRoleKey())
                .defaultHeader("Authorization", "Bearer " + supabaseProperties.getServiceRoleKey())
                .build();
    }

    // Requête pour récupéré les réponse d'un audit
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
