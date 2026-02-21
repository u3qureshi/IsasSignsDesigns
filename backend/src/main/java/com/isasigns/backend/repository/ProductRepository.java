package com.isasigns.backend.repository;

import com.isasigns.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
    List<Product> findByCategoryAndIsActiveTrue(String category);
    List<Product> findByIsActiveTrue();
    Optional<Product> findBySlugAndIsActiveTrue(String slug);
}
