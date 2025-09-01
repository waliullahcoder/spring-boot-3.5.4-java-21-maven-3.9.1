package com.example.core.service;

import com.example.persistence.entity.User;
import com.example.persistence.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.Optional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public void register(User user) {
        userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }


    public User updateProfileById(
            Long id,
            String firstName,
            String lastName,
            String phoneNumber,
            String zipCode,
            String newEmail) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (firstName != null) user.setFirstName(firstName);
        if (lastName != null) user.setLastName(lastName);
        if (phoneNumber != null) user.setPhoneNumber(phoneNumber);
        if (zipCode != null) user.setZipCode(zipCode);
        if (newEmail != null) user.setEmail(newEmail);

        return userRepository.save(user);
    }





}
