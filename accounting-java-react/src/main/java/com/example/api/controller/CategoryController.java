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
@RequestMapping("/api/product/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/add")
    public ResponseEntity<Object> categories(@Valid @RequestBody CategoryRequest req) {
        // Check if category already exists
        if (categoryService.findByName(req.getName()).isPresent()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Name already exists!");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        Category category = Category.builder()
                .name(req.getName())
                .build();

        Category savedCategory = categoryService.categories(category); // save and return

        return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory);
    }






    @GetMapping("/list")
    public ResponseEntity<?> getAllCategories() {
        var users = categoryService.findAll();

        return ResponseEntity.ok(
                users.stream().map(category -> {
                    Map<String, Object> categoryMap = new HashMap<>();
                    categoryMap.put("id", category.getId());
                    categoryMap.put("name", category.getName());
                    categoryMap.put("created_at", category.getCreatedAt());
                    categoryMap.put("updated_at", category.getUpdatedAt());
                    return categoryMap;
                }).toList()
        );
    }

    @PutMapping("/update/{id}")
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
