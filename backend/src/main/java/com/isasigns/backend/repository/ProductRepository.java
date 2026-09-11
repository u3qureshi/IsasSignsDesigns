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

    @Query(value = """
            SELECT *
            FROM products
            WHERE is_active = true
              AND (
                  name ILIKE concat('%', :query, '%')
                  OR coalesce(description, '') ILIKE concat('%', :query, '%')
                  OR coalesce(long_description, '') ILIKE concat('%', :query, '%')
                  OR array_to_string(tags, ' ') ILIKE concat('%', :query, '%')
              )
            ORDER BY is_featured DESC, name
            LIMIT 40
            """, nativeQuery = true)
    List<Product> searchActive(@Param("query") String query);

    Optional<Product> findBySlugAndIsActiveTrue(String slug);
}
