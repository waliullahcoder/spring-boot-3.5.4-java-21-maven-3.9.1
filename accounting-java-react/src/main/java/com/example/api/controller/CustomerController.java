package com.example.api.controller;

import com.example.common.dto.CustomerRequest;
import com.example.common.dto.CustomerUpdateDto;
import com.example.core.service.CustomerService;
import com.example.persistence.entity.Customer;

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
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;
    private final PasswordEncoder passwordEncoder;

    // ---------------- CREATE CUSTOMER ----------------
    @PostMapping("/add")
    public ResponseEntity<?> createCustomer(@Valid @RequestBody CustomerRequest customerRequest) {

        if (customerService.findByEmail(customerRequest.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Customer already exists!"));
        }

        try {
            Customer customer = Customer.builder()
                    .firstName(customerRequest.getFirstName())
                    .lastName(customerRequest.getLastName())
                    .address(customerRequest.getAddress())
                    .phoneNumber(customerRequest.getPhoneNumber())
                    .email(customerRequest.getEmail())
                    .zipCode(customerRequest.getZipCode())
                    .build();

            Customer savedCustomer = customerService.save(customer);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCustomer);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error while saving customer", "error", e.getMessage()));
        }
    }

    // ---------------- GET ALL CUSTOMERS ----------------
    @GetMapping("/list")
    public ResponseEntity<?> getAllCustomers() {
        var customers = customerService.findAll();

        return ResponseEntity.ok(
                customers.stream().map(customer -> {
                    Map<String, Object> customerMap = new HashMap<>();
                    customerMap.put("id", customer.getId());
                    customerMap.put("first_name", customer.getFirstName());
                    customerMap.put("last_name", customer.getLastName());
                    customerMap.put("address", customer.getAddress());
                    customerMap.put("phone_number", customer.getPhoneNumber());
                    customerMap.put("email", customer.getEmail());
                    customerMap.put("zip_code", customer.getZipCode());
                    customerMap.put("created_at", customer.getCreatedAt());
                    customerMap.put("updated_at", customer.getUpdatedAt());
                    return customerMap;
                }).toList()
        );
    }

    // ---------------- UPDATE CUSTOMER ----------------
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody CustomerUpdateDto req
    ) {
        try {
            Customer customerUpdateData = Customer.builder()
                    .firstName(req.getFirstName())
                    .lastName(req.getLastName())
                    .address(req.getAddress())
                    .phoneNumber(req.getPhoneNumber())
                    .email(req.getEmail())
                    .zipCode(req.getZipCode())
                    .build();

            Customer updated = customerService.updateCustomerById(id, customerUpdateData);

            return ResponseEntity.ok(updated);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ---------------- DELETE CUSTOMER ----------------
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> deleteCustomer(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        return customerService.findById(id).map(customer -> {
            try {
                customerService.deleteById(id);
                response.put("message", "Customer deleted successfully");
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                response.put("message", "Failed to delete customer");
                response.put("error", e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        }).orElseGet(() -> {
            response.put("message", "Customer not found with id " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }
}
