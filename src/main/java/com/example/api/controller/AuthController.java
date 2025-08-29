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
                .isSuperadmin(req.getIsSuperadmin() != null ? req.getIsSuperadmin() : false)
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .rememberToken(null)   // later can set for "remember me"
                .build();

        userService.register(user);
        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
            );
            String token = jwtUtil.generateToken(req.getEmail());
            return ResponseEntity.ok(Map.of("token", token));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDto> updateProfile(@RequestBody UserProfileDto req, Principal principal) {
        User updated = userService.updateProfile(
                principal.getName(),       // current email
                req.getFirstName(),
                req.getLastName(),
                req.getPhoneNumber(),
                req.getZipCode(),
                req.getEmail()             // new email
        );

        return ResponseEntity.ok(
                UserProfileDto.builder()
                        .firstName(updated.getFirstName())
                        .lastName(updated.getLastName())
                        .phoneNumber(updated.getPhoneNumber())
                        .zipCode(updated.getZipCode())
                        .email(updated.getEmail())
                        .isSuperadmin(updated.getIsSuperadmin())
                        .build()
        );
    }


    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Logout successful (client removes JWT)");
    }
}
