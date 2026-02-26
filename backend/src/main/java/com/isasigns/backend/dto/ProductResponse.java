package com.isasigns.backend.dto;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.databind.JsonNode;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ProductResponse", description = "Product resource returned by the catalog API")
public record ProductResponse(
        @Schema(description = "Product unique identifier", example = "23e9318b-272c-424e-99d0-671c90b8bcf6") UUID id,
        @Schema(description = "Unique URL slug for product pages", example = "ramadan-lantern") String slug,
        @Schema(description = "Display name", example = "Ramadan Lantern") String name,
        @Schema(description = "Short product description for cards and previews", example = "Decorative lantern for Ramadan") String description,
        @Schema(description = "Full product description for detail pages") String longDescription,
        @Schema(description = "Category label used for storefront filtering", example = "Ramadan Decor") String category,
        @Schema(description = "Price in minor units (cents)", example = "3499") long priceCents,
        @Schema(description = "Currency code", example = "CAD") String currency,
        @ArraySchema(schema = @Schema(example = "/assets/ramadan1.jpg"), arraySchema = @Schema(description = "Product image URLs")) List<String> images,
        @Schema(description = "Primary material", example = "metal") String material,
        @Schema(description = "Active flag used for soft-deactivation", example = "true") Boolean isActive,
        @Schema(description = "Whether this product is featured on the homepage", example = "false") Boolean isFeatured,
        @Schema(description = "Available stock quantity; null means untracked", example = "10") Integer stockQty,
        @Schema(description = "Whether this product supports customization", example = "false") Boolean isCustomizable,
        @ArraySchema(schema = @Schema(example = "montessori"), arraySchema = @Schema(description = "Search and filter tags")) List<String> tags,
        @Schema(description = "Sale configuration; null means not on sale", example = "{\"enabled\": true, \"percent\": 15}") JsonNode onSale,
        @Schema(description = "Record creation timestamp", example = "2026-02-21T07:31:47.474497Z") OffsetDateTime createdAt,
        @Schema(description = "Record last update timestamp", example = "2026-02-21T07:31:47.474497Z") OffsetDateTime updatedAt) {
}
