package com.bajonconsulting.Bajon_audit_App.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

/**
 * Configuration de Swagger/OpenAPI pour l'application Bajon Audit.
 * Cette classe configure la documentation interactive de l'API REST.
 * <p>
 * L'interface Swagger UI est accessible à l'URL : {@code http://localhost:8080/swagger-ui.html}
 *
 * @author Bajon Consulting
 * @version 1.0
 */

@Configuration
public class SwaggerConfig {

    /**
     * Crée et configure l'objet OpenAPI personnalisé pour la documentation de l'API.
     * <p>
     * Cette configuration définit :
     * <ul>
     *   <li>Le titre de l'API : "Bajon Audit API"</li>
     *   <li>La version : "1.0"</li>
     *   <li>La description : API backend admin pour la gestion des utilisateurs</li>
     * </ul>
     *
     * @return l'instance {@link OpenAPI} configurée avec les métadonnées de l'API
     */
    @Bean
    public OpenAPI customOpenAPI(){
        return new OpenAPI()
                .info(new Info()
                        .title("Bajon Audit API")
                        .version("1.0")
                        .description("API backend admin pour la gestions des utilisateurs"));
    }
}


