package com.example.core.service.impl;

import com.example.core.service.ProductService;
import com.example.persistence.entity.Product;
import com.example.persistence.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public Product save(Product product) {
        return productRepository.save(product);
    }

    @Override
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    @Override
    public Optional<Product> findByCode(String code) {
        return productRepository.findByCode(code);
    }

    @Override
    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }

    @Override
    public Product updateProductById(Long id, Product productUpdateData) {
        return productRepository.findById(id).map(existing -> {
            existing.setName(productUpdateData.getName()); // fixed: setName instead of setModel
            existing.setModel(productUpdateData.getModel());
            existing.setCode(productUpdateData.getCode());
            existing.setCategoryId(productUpdateData.getCategoryId());
            existing.setQuantity(productUpdateData.getQuantity());
            existing.setSalePrice(productUpdateData.getSalePrice());
            existing.setPurchasePrice(productUpdateData.getPurchasePrice());
            existing.setImage(productUpdateData.getImage());
            return productRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Product not found with id " + id));
    }
}
