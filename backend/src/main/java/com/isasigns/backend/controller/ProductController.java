package com.isasigns.backend.controller;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.isasigns.backend.dto.ProductResponse;
import com.isasigns.backend.model.Product;
import com.isasigns.backend.repository.ProductRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Products", description = "Catalog read endpoints")
public class ProductController {
    private final ProductRepository repo;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ProductController(ProductRepository repo) {
        this.repo = repo;
    }

    @Operation(summary = "List products", description = "Returns active products. Optionally filter by category (case-insensitive).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Products returned", content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = ProductResponse.class)), examples = @ExampleObject(name = "list-products", summary = "Sample response", value = "[{\"id\":\"23e9318b-272c-424e-99d0-671c90b8bcf6\",\"slug\":\"ramadan-lantern\",\"name\":\"Ramadan Lantern\",\"description\":\"Decorative lantern for Ramadan\",\"category\":\"Ramadan Decor\",\"priceCents\":3499,\"currency\":\"CAD\",\"images\":[\"/assets/ramadan1.jpg\"],\"material\":\"metal\",\"isActive\":true}]")))
    })
    @GetMapping
    public List<ProductResponse> list(
            @Parameter(description = "Category filter (case-insensitive)", example = "Kids") @RequestParam(required = false) String category) {
        if (category != null && !category.isBlank()) {
            return repo.findByCategoryIgnoreCaseAndIsActiveTrue(category).stream().map(this::toResponse).toList();
        }
        return repo.findByIsActiveTrue().stream().map(this::toResponse).toList();
    }

    @Operation(summary = "Get product by slug", description = "Returns one active product by slug.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ProductResponse.class))),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    @GetMapping("/{slug}")
    public ProductResponse bySlug(
            @Parameter(description = "Product slug", example = "ramadan-lantern") @PathVariable String slug) {
        Product product = repo.findBySlugAndIsActiveTrue(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        return toResponse(product);
    }

    private ProductResponse toResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getSlug(),
                product.getName(),
                product.getDescription(),
                product.getLongDescription(),
                product.getCategory(),
                product.getPriceCents(),
                product.getCurrency(),
                parseImages(product.getImages()),
                product.getMaterial(),
                product.getIsActive(),
                product.getIsFeatured(),
                product.getStockQty(),
                product.getIsCustomizable(),
                java.util.Arrays.asList(product.getTags()),
                parseJson(product.getOnSale()),
                product.getCreatedAt(),
                product.getUpdatedAt());
    }

    private List<String> parseImages(String imagesJson) {
        if (imagesJson == null || imagesJson.isBlank()) {
            return Collections.emptyList();
        }
        try {
            return objectMapper.readValue(imagesJson, new TypeReference<List<String>>() {
            });
        } catch (IOException e) {
            return List.of(imagesJson);
        }
    }

    private JsonNode parseJson(String json) {
        if (json == null || json.isBlank())
            return null;
        try {
            return objectMapper.readTree(json);
        } catch (IOException e) {
            return null;
        }
    }
}
