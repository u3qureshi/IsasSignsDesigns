package com.isasigns.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.isasigns.backend.dto.account.AccountCustomRequestImageResponse;
import com.isasigns.backend.dto.account.AccountCustomRequestResponse;
import com.isasigns.backend.dto.checkout.OrderConfirmationResponse;
import com.isasigns.backend.dto.checkout.OrderItemResponse;
import com.isasigns.backend.model.CustomEmbroideryRequest;
import com.isasigns.backend.model.CustomerOrder;
import com.isasigns.backend.repository.CustomEmbroideryRequestImageRepository;
import com.isasigns.backend.repository.CustomEmbroideryRequestRepository;
import com.isasigns.backend.repository.CustomerOrderRepository;

@Service
public class AccountHistoryService {
    private final CurrentUserService currentUserService;
    private final CustomerOrderRepository orderRepository;
    private final CustomEmbroideryRequestRepository requestRepository;
    private final CustomEmbroideryRequestImageRepository imageRepository;

    public AccountHistoryService(
            CurrentUserService currentUserService,
            CustomerOrderRepository orderRepository,
            CustomEmbroideryRequestRepository requestRepository,
            CustomEmbroideryRequestImageRepository imageRepository) {
        this.currentUserService = currentUserService;
        this.orderRepository = orderRepository;
        this.requestRepository = requestRepository;
        this.imageRepository = imageRepository;
    }

    @Transactional(readOnly = true)
    public List<OrderConfirmationResponse> orders() {
        var user = currentUserService.requireCurrentUser();
        return orderRepository.findAccountOrders(user.getId(), user.getNormalizedEmail()).stream()
                .map(this::toOrderResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AccountCustomRequestResponse> requests() {
        var user = currentUserService.requireCurrentUser();
        return requestRepository.findAccountRequests(user.getId(), user.getNormalizedEmail()).stream()
                .map(this::toRequestResponse)
                .toList();
    }

    private OrderConfirmationResponse toOrderResponse(CustomerOrder order) {
        return new OrderConfirmationResponse(
                order.getOrderNumber(), order.getStatus().name(), order.getCurrency(),
                order.getSubtotalCents(), order.getShippingCents(), order.getTaxCents(), order.getTotalCents(),
                order.getCustomerEmail(), order.getCreatedAt(), order.getPaidAt(),
                order.getItems().stream().map(item -> new OrderItemResponse(
                        item.getProductSlug(), item.getProductName(), item.getVariantName(), item.getSize(),
                        item.getImagePublicId(), item.getUnitPriceCents(), item.getQuantity(),
                        item.getLineTotalCents())).toList());
    }

    private AccountCustomRequestResponse toRequestResponse(CustomEmbroideryRequest request) {
        var images = imageRepository.findAllByRequestIdOrderByDisplayOrderAsc(request.getId()).stream()
                .map(image -> new AccountCustomRequestImageResponse(
                        image.getImageType(), image.getCloudinaryPublicId(), image.getFormat()))
                .toList();
        return new AccountCustomRequestResponse(
                request.getRequestNumber(), request.getServiceType(), request.getStatus(), request.getCreatedAt(),
                request.getItemType(), request.getCustomItemDescription(), request.getGarmentColor(),
                request.getPlacement(), request.getCustomPlacementDescription(), request.getSizeMode(),
                request.getRequestedWidthInches(), request.getRequestedHeightInches(), request.getQuantity(),
                request.getIdeaDescription(), request.getExactText(), request.isAiUsed(), images);
    }
}
