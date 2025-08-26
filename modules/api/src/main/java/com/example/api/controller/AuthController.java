package com.example.api.controller;

import com.example.common.dto.*;
import com.example.core.service.UserService;
import com.example.persistence.entity.User;
import com.example.security.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
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

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest req) {
        if (userService.findByUsername(req.getUsername()).isPresent()) {
            return "Username already exists!";
        }
        User user = User.builder()
                .username(req.getUsername())
                .password(req.getPassword())
                .email(req.getEmail())
                .fullName(req.getFullName())
                .build();
        userService.register(user);
        return "User registered successfully";
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest req) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));
        String token = jwtUtil.generateToken(req.getUsername());
        return Map.of("token", token);
    }

    @PutMapping("/profile")
    public UserProfileDto updateProfile(@RequestBody UserProfileDto req, Principal principal) {
        User updated = userService.updateProfile(principal.getName(), req.getEmail(), req.getFullName());
        UserProfileDto dto = new UserProfileDto();
        dto.setUsername(updated.getUsername());
        dto.setEmail(updated.getEmail());
        dto.setFullName(updated.getFullName());
        return dto;
    }

    @PostMapping("/logout")
    public String logout() {
        return "Logout successful (client removes JWT)";
    }
}
