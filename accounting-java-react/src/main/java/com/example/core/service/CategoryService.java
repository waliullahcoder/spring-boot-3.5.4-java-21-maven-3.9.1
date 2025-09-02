package com.example.core.service;

import com.example.persistence.entity.Category;
import com.example.persistence.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.Optional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public void categories(Category ctegory) {
        categoryRepository.save(ctegory);
    }

    public Optional<Category> findByName(String name) {
        return categoryRepository.findByName(name);
    }

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }


    public Category updateCategoryById(Long id,
                                  String name) {
        Category ctegory = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (name != null) ctegory.setName(name);

        return categoryRepository.save(ctegory);
    }






}
