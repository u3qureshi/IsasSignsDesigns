package com.isasigns.backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.isasigns.backend.model.CustomEmbroideryNotification;

public interface CustomEmbroideryNotificationRepository
        extends JpaRepository<CustomEmbroideryNotification, UUID> {
}
