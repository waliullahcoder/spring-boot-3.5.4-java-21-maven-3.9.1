package com.example.persistence.entity;

import jakarta.persistence.*;
import lombok.*;  // Lombok ব্যবহার করবো

@Entity
@Table(name = "users")
@Data                   // getter, setter, toString, equals, hashCode সব তৈরি করে দিবে
@NoArgsConstructor      // default constructor
@AllArgsConstructor     // all args constructor
@Builder                // builder pattern enable
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    private String email;

    private String fullName;

    private String role;
}
