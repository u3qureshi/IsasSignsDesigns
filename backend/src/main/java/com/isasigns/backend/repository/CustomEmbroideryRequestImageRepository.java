package com.isasigns.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.isasigns.backend.model.CustomEmbroideryRequestImage;

public interface CustomEmbroideryRequestImageRepository
        extends JpaRepository<CustomEmbroideryRequestImage, UUID> {
    List<CustomEmbroideryRequestImage> findAllByRequestIdOrderByDisplayOrderAsc(UUID requestId);
}
