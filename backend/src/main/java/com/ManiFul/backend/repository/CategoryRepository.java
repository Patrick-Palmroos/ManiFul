package com.ManiFul.backend.repository;

import com.ManiFul.backend.model.Category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.types WHERE c.userId = :userId")
    List<Category> findByUserIdWithTypes(@Param("userId") Long userId);
}
