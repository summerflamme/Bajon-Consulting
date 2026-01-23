package com.bajonconsulting.Bajon_audit_App.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI customOpenAPI(){
        return new OpenAPI()
                .info(new Info()
                        .title("Bajon Audit API")
                        .version("1.0")
                        .description("API backend admin pour la gestions des utilisateurs"));
    }
}


/*
url
http://localhost:8080/swagger-ui.html
 */