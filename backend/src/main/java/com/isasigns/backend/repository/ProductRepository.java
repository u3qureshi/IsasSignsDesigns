package com.isasigns.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.isasigns.backend.model.Product;

public interface ProductRepository extends JpaRepository<Product, UUID> {
    List<Product> findByCategoryIgnoreCaseAndIsActiveTrue(String category);

    List<Product> findByIsActiveTrue();

    Optional<Product> findBySlugAndIsActiveTrue(String slug);
}
