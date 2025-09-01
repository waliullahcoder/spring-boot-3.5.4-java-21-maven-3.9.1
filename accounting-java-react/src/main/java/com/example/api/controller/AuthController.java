package com.example.api.controller;

import com.example.common.dto.LoginRequest;
import com.example.common.dto.RegisterRequest;
import com.example.common.dto.UserProfileDto;
import com.example.core.service.UserService;
import com.example.persistence.entity.User;
import com.example.security.jwt.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest req) {
        if (userService.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists!");
        }

        User user = User.builder()
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .phoneNumber(req.getPhoneNumber())
                .zipCode(req.getZipCode())
                .isSuperadmin(req.getIsSuperadminAsBoolean()) // ✅ convert 0/1 → boolean
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .rememberToken(null)   // later can set for "remember me"
                .build();

        userService.register(user);
        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequest req) {
        try {
            // Authenticate
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
            );

            // Fetch user
            Optional<User> optionalUser = userService.findByEmail(req.getEmail());
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid email or password"));
            }
            User user = optionalUser.get();

            // Convert boolean to 1/0
            int isSuperadminInt = user.getIsSuperadmin() != null && user.getIsSuperadmin() ? 1 : 0;

            // Build user map
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("first_name", user.getFirstName());
            userMap.put("last_name", user.getLastName());
            userMap.put("phone_number", user.getPhoneNumber());
            userMap.put("zip_code", user.getZipCode());
            userMap.put("is_superadmin", isSuperadminInt); // 1/0 instead of true/false
            userMap.put("email", user.getEmail());
            userMap.put("email_verified_at", user.getEmailVerifiedAt());
            userMap.put("password", user.getPassword());
            userMap.put("remember_token", user.getRememberToken());
            userMap.put("created_at", user.getCreatedAt());
            userMap.put("updated_at", user.getUpdatedAt());

            // Build final response
            Map<String, Object> response = new HashMap<>();
            response.put("user", userMap);
            response.put("access_token", jwtUtil.generateToken(user.getEmail()));
            response.put("token_type", "bearer");
            response.put("is_superadmin", isSuperadminInt); // top-level also 1/0
            response.put("expires_in", 2073600);

            return ResponseEntity.ok(response);

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }
    }


    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        var users = userService.findAll();

        return ResponseEntity.ok(
                users.stream().map(user -> {
                    // superadmin কে 1/0 এ কনভার্ট
                    int isSuperadminInt = user.getIsSuperadmin() != null && user.getIsSuperadmin() ? 1 : 0;

                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", user.getId());
                    userMap.put("first_name", user.getFirstName());
                    userMap.put("last_name", user.getLastName());
                    userMap.put("phone_number", user.getPhoneNumber());
                    userMap.put("zip_code", user.getZipCode());
                    userMap.put("is_superadmin", isSuperadminInt);
                    userMap.put("email", user.getEmail());
                    userMap.put("email_verified_at", user.getEmailVerifiedAt());
                    userMap.put("created_at", user.getCreatedAt());
                    userMap.put("updated_at", user.getUpdatedAt());
                    return userMap;
                }).toList()
        );
    }



    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long id,
            @RequestBody UserProfileDto req) {

        System.out.println("Updating user id: " + id);
        System.out.println("Incoming firstName: " + req.getFirstName());

        try {
            User updated = userService.updateProfileById(
                    id,
                    req.getFirstName(),
                    req.getLastName(),
                    req.getPhoneNumber(),
                    req.getZipCode(),
                    req.getEmail(),
                    req.getIsSuperadmin()   // <- pass this
            );

            return ResponseEntity.ok(UserProfileDto.builder()
                    .firstName(updated.getFirstName())
                    .lastName(updated.getLastName())
                    .phoneNumber(updated.getPhoneNumber())
                    .zipCode(updated.getZipCode())
                    .email(updated.getEmail())
                    .isSuperadmin(updated.getIsSuperadmin())
                    .build()
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }





    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Logout successful (client removes JWT)");
    }
}
