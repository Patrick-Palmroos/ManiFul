package com.ManiFul.backend.repository;

import com.ManiFul.backend.model.Type;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TypeRepository extends JpaRepository<Type, Long> {
    List<Type> findByUserId(Long userId);
    List<Type> findByCategoryId(Long categoryId);
}
