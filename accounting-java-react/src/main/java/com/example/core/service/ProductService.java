package com.example.core.service;

import com.example.persistence.entity.Product;

import java.util.List;
import java.util.Optional;

public interface ProductService {
    Product save(Product product);

    List<Product> findAll();

    Optional<Product> findByCode(String code);

    Optional<Product> findById(Long id);

    Product updateProductById(Long id, Product productUpdateData);
}
