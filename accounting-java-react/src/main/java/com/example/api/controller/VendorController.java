package com.example.api.controller;

import com.example.common.dto.VendorRequest;
import com.example.common.dto.VendorUpdateDto;
import com.example.core.service.VendorService;
import com.example.persistence.entity.Vendor;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.security.jwt.JwtUtil;

import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@RestController
@RequestMapping("/api/vendor")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;
    private final PasswordEncoder passwordEncoder;

    // ---------------- CREATE VENDOR ----------------
    @PostMapping("/add")
    public ResponseEntity<?> createVendor(@Valid @RequestBody VendorRequest vendorRequest) {

        if (vendorService.findByEmail(vendorRequest.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Vendor already exists!"));
        }

        try {
            Vendor vendor = Vendor.builder()
                    .firstName(vendorRequest.getFirstName())
                    .lastName(vendorRequest.getLastName())
                    .address(vendorRequest.getAddress())
                    .phoneNumber(vendorRequest.getPhoneNumber())
                    .email(vendorRequest.getEmail())
                    .zipCode(vendorRequest.getZipCode())
                    .build();

            Vendor savedVendor = vendorService.save(vendor);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedVendor);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error while saving vendor", "error", e.getMessage()));
        }
    }

    // ---------------- GET ALL VENDORS ----------------
    @GetMapping("/list")
    public ResponseEntity<?> getAllVendors() {
        var vendors = vendorService.findAll();

        return ResponseEntity.ok(
                vendors.stream().map(vendor -> {
                    Map<String, Object> vendorMap = new HashMap<>();
                    vendorMap.put("id", vendor.getId());
                    vendorMap.put("first_name", vendor.getFirstName());
                    vendorMap.put("last_name", vendor.getLastName());
                    vendorMap.put("address", vendor.getAddress());
                    vendorMap.put("phone_number", vendor.getPhoneNumber());
                    vendorMap.put("email", vendor.getEmail());
                    vendorMap.put("zip_code", vendor.getZipCode());
                    vendorMap.put("created_at", vendor.getCreatedAt());
                    vendorMap.put("updated_at", vendor.getUpdatedAt());
                    return vendorMap;
                }).toList()
        );
    }

    // ---------------- UPDATE VENDOR ----------------
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateVendor(
            @PathVariable Long id,
            @Valid @RequestBody VendorUpdateDto req
    ) {
        try {
            Vendor vendorUpdateData = Vendor.builder()
                    .firstName(req.getFirstName())
                    .lastName(req.getLastName())
                    .address(req.getAddress())
                    .phoneNumber(req.getPhoneNumber())
                    .email(req.getEmail())
                    .zipCode(req.getZipCode())
                    .build();

            Vendor updated = vendorService.updateVendorById(id, vendorUpdateData);

            return ResponseEntity.ok(updated);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ---------------- DELETE VENDOR ----------------
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> deleteVendor(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        return vendorService.findById(id).map(vendor -> {
            try {
                vendorService.deleteById(id);
                response.put("message", "Vendor deleted successfully");
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                response.put("message", "Failed to delete vendor");
                response.put("error", e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        }).orElseGet(() -> {
            response.put("message", "Vendor not found with id " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }
}
