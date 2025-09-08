package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = {
        "com.example.core.repository",      // scan your repositories
        "com.example.persistence.repository"
})
@EntityScan(basePackages = "com.example.persistence.entity")
@EnableJpaAuditing
public class AccountingJavaReactApplication {
    public static void main(String[] args) {
        SpringApplication.run(AccountingJavaReactApplication.class, args);
    }
}
