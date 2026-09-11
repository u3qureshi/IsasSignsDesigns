package com.isasigns.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.isasigns.backend.model.CustomerOrder;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, UUID> {
    Optional<CustomerOrder> findByOrderNumber(String orderNumber);

    @EntityGraph(attributePaths = "items")
    Optional<CustomerOrder> findByStripeCheckoutSessionId(String stripeCheckoutSessionId);

    @EntityGraph(attributePaths = "items")
    @Query("""
            select distinct orders
            from CustomerOrder orders
            where orders.userId = :userId
               or lower(orders.customerEmail) = :normalizedEmail
            order by orders.createdAt desc
            """)
    List<CustomerOrder> findAccountOrders(
            @Param("userId") UUID userId,
            @Param("normalizedEmail") String normalizedEmail);
}
