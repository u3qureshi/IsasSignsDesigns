package com.isasigns.backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.isasigns.backend.model.CustomEmbroideryRequest;

public interface CustomEmbroideryRequestRepository extends JpaRepository<CustomEmbroideryRequest, UUID> {
    boolean existsByRequestNumber(String requestNumber);
}
