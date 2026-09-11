package com.isasigns.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.isasigns.backend.model.CustomEmbroideryRequest;

public interface CustomEmbroideryRequestRepository extends JpaRepository<CustomEmbroideryRequest, UUID> {
    boolean existsByRequestNumber(String requestNumber);

    @Query("""
            select request
            from CustomEmbroideryRequest request
            where request.userId = :userId
               or lower(request.customerEmail) = :normalizedEmail
            order by request.createdAt desc
            """)
    List<CustomEmbroideryRequest> findAccountRequests(
            @Param("userId") UUID userId,
            @Param("normalizedEmail") String normalizedEmail);
}
