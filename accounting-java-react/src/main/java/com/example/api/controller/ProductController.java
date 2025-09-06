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
@RequestMapping("/api/product")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // Allow React frontend
public class ProductController {

    private final ProductService productService;
    private static final String UPLOAD_DIR = "uploads/products/";

    // ========================
    // CREATE (with image upload)
    // ========================
    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Product> createProduct(
            @RequestParam String name,
            @RequestParam String model,
            @RequestParam String code,
            @RequestParam("category_id") Long categoryId,
            @RequestParam Integer quantity,
            @RequestParam("sale_price") Double salePrice,
            @RequestParam("purchase_price") Double purchasePrice,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        try {
            String filePath = (imageFile != null && !imageFile.isEmpty()) ? saveImage(imageFile) : null;

            Product product = Product.builder()
                    .name(name)
                    .model(model)
                    .code(code)
                    .categoryId(categoryId)
                    .quantity(quantity)
                    .salePrice(salePrice)
                    .purchasePrice(purchasePrice)
                    .image(filePath)
                    .build();

            Product savedProduct = productService.save(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ========================
    // READ all products
    // ========================
    @GetMapping("/list")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.findAll());
    }

    // ========================
    // READ product by id
    // ========================
    @GetMapping("/edit/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // ========================
    // UPDATE product (with optional image replacement)
    // ========================
    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam String model,
            @RequestParam String code,
            @RequestParam("category_id") Long categoryId,
            @RequestParam Integer quantity,
            @RequestParam("sale_price") Double salePrice,
            @RequestParam("purchase_price") Double purchasePrice,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        try {
            Product existing = productService.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found with id " + id));

            String filePath = existing.getImage();
            if (imageFile != null && !imageFile.isEmpty()) {
                if (filePath != null) {
                    Files.deleteIfExists(Paths.get(filePath.startsWith("/") ? filePath.substring(1) : filePath));
                }
                filePath = saveImage(imageFile);
            }

            existing.setName(name);
            existing.setModel(model);
            existing.setCode(code);
            existing.setCategoryId(categoryId);
            existing.setQuantity(quantity);
            existing.setSalePrice(salePrice);
            existing.setPurchasePrice(purchasePrice);
            existing.setImage(filePath);

            Product updated = productService.save(existing);
            return ResponseEntity.ok(updated);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ========================
    // DELETE product
    // ========================
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        return productService.findById(id).map(product -> {
            try {
                if (product.getImage() != null) {
                    String filePath = product.getImage();
                    Files.deleteIfExists(Paths.get(filePath.startsWith("/") ? filePath.substring(1) : filePath));
                }
                productService.deleteById(id);
                response.put("message", "Product deleted successfully");
                return ResponseEntity.ok(response);
            } catch (IOException e) {
                response.put("message", "Failed to delete image");
                response.put("error", e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        }).orElseGet(() -> {
            response.put("message", "Product not found with id " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // ========================
    // Utility: Save file (returns path with "/uploads/products/...")
    // ========================
    private String saveImage(MultipartFile file) throws IOException {
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) uploadDir.mkdirs();

        String extension = "";
        String originalName = file.getOriginalFilename();
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }

        String uniqueName = "image-" + System.currentTimeMillis() + "-" + UUID.randomUUID() + extension;
        Path filePath = Paths.get(UPLOAD_DIR, uniqueName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/" + UPLOAD_DIR + uniqueName;
    }
}
