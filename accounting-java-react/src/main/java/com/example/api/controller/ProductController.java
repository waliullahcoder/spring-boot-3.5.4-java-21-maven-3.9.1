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
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private static final String UPLOAD_DIR = "uploads/products/";

    // ========================
    // CREATE (with image upload)
    // ========================
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> createProduct(
            @RequestParam String name,
            @RequestParam String model,
            @RequestParam String code,
            @RequestParam Long categoryId,
            @RequestParam Integer quantity,
            @RequestParam Double salePrice,
            @RequestParam Double purchasePrice,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            String fileName = (imageFile != null && !imageFile.isEmpty()) ? saveImage(imageFile) : null;

            Product product = Product.builder()
                    .name(name)
                    .model(model)
                    .code(code)
                    .categoryId(categoryId)
                    .quantity(quantity)
                    .salePrice(salePrice)
                    .purchasePrice(purchasePrice)
                    .image(fileName)
                    .build();

            Product savedProduct = productService.save(product);

            response.put("message", "Product created successfully");
            response.put("product", savedProduct);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IOException e) {
            response.put("message", "Image upload failed");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ========================
    // READ all products
    // ========================
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.findAll());
    }

    // ========================
    // READ product by id
    // ========================
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getProductById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        Optional<Product> productOpt = productService.findById(id);
        if (productOpt.isPresent()) {
            response.put("product", productOpt.get());
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Product not found with id " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // ========================
    // UPDATE product (with optional image replacement)
    // ========================
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> updateProduct(
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
        Map<String, Object> response = new HashMap<>();
        try {
            Product existing = productService.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found with id " + id));

            String fileName = existing.getImage();
            if (imageFile != null && !imageFile.isEmpty()) {
                if (fileName != null) {
                    Files.deleteIfExists(Paths.get(UPLOAD_DIR, fileName));
                }
                fileName = saveImage(imageFile);
            }

            existing.setName(name);
            existing.setModel(model);
            existing.setCode(code);
            existing.setCategoryId(categoryId);
            existing.setQuantity(quantity);
            existing.setSalePrice(salePrice);
            existing.setPurchasePrice(purchasePrice);
            existing.setImage(fileName);

            Product updated = productService.save(existing);

            response.put("message", "Product updated successfully");
            response.put("product", updated);
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (IOException e) {
            response.put("message", "Image upload failed");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ========================
    // DELETE product
    // ========================
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        return productService.findById(id).map(product -> {
            try {
                if (product.getImage() != null) {
                    Files.deleteIfExists(Paths.get(UPLOAD_DIR, product.getImage()));
                }
                productService.deleteById(id); // make sure deleteById exists in service
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
    // Utility to save file
    // ========================
    private String saveImage(MultipartFile file) throws IOException {
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) uploadDir.mkdirs();

        String extension = "";
        String originalName = file.getOriginalFilename();
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }

        String uniqueName = System.currentTimeMillis() + "-" + UUID.randomUUID() + extension;
        Path filePath = Paths.get(UPLOAD_DIR, uniqueName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return uniqueName;
    }
}
