package com.example.api.controller;

import com.example.common.dto.CategoryRequest;
import com.example.common.dto.CategoryUpdateDto;
import com.example.core.service.CategoryService;
import com.example.persistence.entity.Category;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.security.jwt.JwtUtil;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;


@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/categories")
    public ResponseEntity<String> categories(@Valid @RequestBody CategoryRequest req) {
        System.out.println("WALI"+req);
        if (categoryService.findByName(req.getName()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Name already exists!");
        }

        Category category = Category.builder()
                .name(req.getName())
                .build();

        categoryService.categories(category);
        return ResponseEntity.status(HttpStatus.CREATED).body("Category registered successfully");
    }

    


    @GetMapping("/categories")
    public ResponseEntity<?> getAllCategories() {
        var users = categoryService.findAll();

        return ResponseEntity.ok(
                users.stream().map(category -> {
                    Map<String, Object> categoryMap = new HashMap<>();
                    categoryMap.put("name", category.getName());
                    categoryMap.put("created_at", category.getCreatedAt());
                    categoryMap.put("updated_at", category.getUpdatedAt());
                    return categoryMap;
                }).toList()
        );
    }

    @PutMapping("/category/{id}")
    public ResponseEntity<?> updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryUpdateDto req) {

        System.out.println("Updating Category id: " + id);
        System.out.println("Incoming Name: " + req.getName());

        try {
            Category updated = categoryService.updateCategoryById(
                    id,
                    req.getName()
            );

            return ResponseEntity.ok(CategoryUpdateDto.builder()
                    .name(updated.getName())
                    .build()
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }




}
