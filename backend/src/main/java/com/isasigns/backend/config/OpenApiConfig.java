package com.isasigns.backend.config;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.servers.Server;

@Configuration
@OpenAPIDefinition(info = @Info(title = "Isa's Signs & Designs API", version = "v1", description = "Product catalog read API for storefront product listing and product detail pages.", contact = @Contact(name = "Isa's Signs & Designs", email = "support@isasignsdesigns.local"), license = @License(name = "Internal Use")), servers = {
        @Server(url = "http://localhost:8081", description = "Local development")
})
public class OpenApiConfig {
}
