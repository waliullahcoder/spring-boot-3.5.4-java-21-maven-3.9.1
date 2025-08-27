package com.example.persistence.repository;

import com.example.persistence.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Custom finder method - তুমি username/email যেটা ব্যবহার করো সেটা এখানে দাও
    Optional<User> findByUsername(String username);

}
