package com.isasigns.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.isasigns.backend.model.Product;

public interface ProductRepository extends JpaRepository<Product, UUID> {
    List<Product> findByCategoryIgnoreCaseAndIsActiveTrue(String category);

    List<Product> findByIsActiveTrue();

    List<Product> findByIsFeaturedTrueAndIsActiveTrue();

    @Query(value = """
            SELECT *
            FROM products
            WHERE is_active = true
              AND :tag = ANY(tags)
            ORDER BY created_at, name
            """, nativeQuery = true)
    List<Product> findActiveByTag(@Param("tag") String tag);

    Optional<Product> findBySlugAndIsActiveTrue(String slug);
}
