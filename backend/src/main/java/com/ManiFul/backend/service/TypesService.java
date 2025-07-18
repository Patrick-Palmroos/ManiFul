package com.ManiFul.backend.service;

import com.ManiFul.backend.model.Type;
import com.ManiFul.backend.repository.TypeRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TypesService {
    private final TypeRepository typeRepository;

    public TypesService(TypeRepository typeRepository) {
        this.typeRepository = typeRepository;
    }

    public List<Type> getTypesByUserId(Long userId) {
        return typeRepository.findByUserId(userId);
    }
}
