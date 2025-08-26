package com.example.core.service;

import com.example.persistence.entity.User;
import com.example.persistence.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repo;
    private final PasswordEncoder encoder;

    public User register(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return repo.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return repo.findByUsername(username);
    }

    public User updateProfile(String username, String email, String fullName) {
        User user = repo.findByUsername(username).orElseThrow();
        user.setEmail(email);
        user.setFullName(fullName);
        return repo.save(user);
    }
}
