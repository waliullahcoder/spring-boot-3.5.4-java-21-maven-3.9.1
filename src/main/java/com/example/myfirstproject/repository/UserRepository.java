package com.example.myfirstproject.repository;

import com.example.myfirstproject.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
