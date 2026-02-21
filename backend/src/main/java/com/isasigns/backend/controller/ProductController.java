package com.isasigns.backend.controller;

import com.isasigns.backend.model.Product;
import com.isasigns.backend.repository.ProductRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductRepository repo;

    public ProductController(ProductRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Product> list(@RequestParam(required = false) String category) {
        if (category != null && !category.isBlank()) {
            return repo.findByCategoryAndIsActiveTrue(category);
        }
        return repo.findByIsActiveTrue();
    }

    @GetMapping("/{slug}")
    public Product bySlug(@PathVariable String slug) {
        return repo.findBySlugAndIsActiveTrue(slug).orElse(null);
    }
}
