package com.ManiFul.backend.controller;

import com.ManiFul.backend.model.Category;
import com.ManiFul.backend.service.CategoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {
    private final CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/getAll")
    public List<Category> getAllCategoriesWithTypes(@AuthenticationPrincipal Jwt jwt) {
        Long userId = jwt.getClaim("id");
        return categoryService.getCategoriesWithTypes(userId);
    }
}
