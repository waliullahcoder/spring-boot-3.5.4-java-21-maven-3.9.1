package com.example.security.service;

import com.example.persistence.entity.User;
import com.example.persistence.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Spring Security UserDetails object তৈরি করা
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())          // authentication হবে email দিয়ে
                .password(user.getPassword())
                .roles(user.getIsSuperadmin() != null && user.getIsSuperadmin() ? "SUPERADMIN" : "USER")
                .build();
    }
}
