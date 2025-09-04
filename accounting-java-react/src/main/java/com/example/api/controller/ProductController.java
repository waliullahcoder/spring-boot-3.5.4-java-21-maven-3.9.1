package com.example.api.controller;

import com.example.core.service.ProductService;
import com.example.persistence.entity.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    private static final String UPLOAD_DIR = "uploads/products/";

    // Insert product with image
    @PostMapping(value = "/products", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> createProduct(
            @RequestParam String name,
            @RequestParam String model,
            @RequestParam String code,
            @RequestParam Long categoryId,
            @RequestParam Integer quantity,
            @RequestParam Double salePrice,
            @RequestParam Double purchasePrice,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        try {
            String fileName = null;
            if (imageFile != null && !imageFile.isEmpty()) {
                fileName = saveImage(imageFile);
            }

            Product product = Product.builder()
                    .model(name)
                    .model(model)
                    .code(code)
                    .categoryId(categoryId)
                    .quantity(quantity)
                    .salePrice(salePrice)
                    .purchasePrice(purchasePrice)
                    .image(fileName) // store relative path or filename in DB
                    .build();

            productService.save(product);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Product created successfully", "image", fileName));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Image upload failed", "error", e.getMessage()));
        }
    }

    // Update product with optional image replacement
    @PutMapping(value = "/products/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam String model,
            @RequestParam String code,
            @RequestParam Long categoryId,
            @RequestParam Integer quantity,
            @RequestParam Double salePrice,
            @RequestParam Double purchasePrice,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        try {
            Product existing = productService.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found with id " + id));

            String fileName = existing.getImage(); // keep old image if not replaced

            // Replace image if new one is uploaded
            if (imageFile != null && !imageFile.isEmpty()) {
                // delete old image if exists
                if (fileName != null) {
                    Path oldPath = Paths.get(UPLOAD_DIR, fileName);
                    Files.deleteIfExists(oldPath);
                }
                fileName = saveImage(imageFile);
            }
            existing.setModel(name);
            existing.setModel(model);
            existing.setCode(code);
            existing.setCategoryId(categoryId);
            existing.setQuantity(quantity);
            existing.setSalePrice(salePrice);
            existing.setPurchasePrice(purchasePrice);
            existing.setImage(fileName);

            productService.save(existing);

            return ResponseEntity.ok(Map.of("message", "Product updated successfully", "image", fileName));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Image upload failed", "error", e.getMessage()));
        }
    }

    // Utility to save file (like multer storage)
    private String saveImage(MultipartFile file) throws IOException {
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs(); // create directories recursively
        }

        String uniqueName = System.currentTimeMillis() + "-" + UUID.randomUUID() +
                file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));

        Path filePath = Paths.get(UPLOAD_DIR, uniqueName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return uniqueName;
    }
}
