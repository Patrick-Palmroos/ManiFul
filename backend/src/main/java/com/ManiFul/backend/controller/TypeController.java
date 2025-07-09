package com.ManiFul.backend.controller;

import com.ManiFul.backend.model.Type;
import com.ManiFul.backend.repository.TypeRepository;
import com.ManiFul.backend.service.CategoryService;
import com.ManiFul.backend.service.TypesService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/types")
public class TypeController {
    private final TypesService typesService;

    @Autowired
    public TypeController(TypesService typesService) {
        this.typesService = typesService;
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Type>> getAllTypes(@AuthenticationPrincipal Jwt jwt) {
        Long userId = jwt.getClaim("id");
        return ResponseEntity.ok(typesService.getTypesByUserId(userId));
    }
}
