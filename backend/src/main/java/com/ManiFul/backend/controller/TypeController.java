package com.ManiFul.backend.controller;

import com.ManiFul.backend.model.Type;
import com.ManiFul.backend.repository.TypeRepository;
import com.ManiFul.backend.service.CategoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/types")
public class TypeController {
    private final TypeRepository typeRepository;

    @Autowired
    public TypeController(TypeRepository typeRepository) {
        this.typeRepository = typeRepository;
    }

    @GetMapping("/getAll")
    public List<Type> getAllTypes(@AuthenticationPrincipal Jwt jwt) {
        Long userId = jwt.getClaim("id");
        return typeRepository.findByUserId(userId);
    }
}
