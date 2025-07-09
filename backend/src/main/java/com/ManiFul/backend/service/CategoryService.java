package com.ManiFul.backend.service;

import com.ManiFul.backend.model.Category;
import com.ManiFul.backend.repository.CategoryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import jakarta.transaction.Transactional;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public List<Category> getCategoriesWithTypes(Long userId) {
        return categoryRepository.findByUserIdWithTypes(userId);
    }
}
