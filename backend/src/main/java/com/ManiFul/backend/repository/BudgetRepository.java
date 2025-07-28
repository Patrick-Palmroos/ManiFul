package com.ManiFul.backend.repository;

import com.ManiFul.backend.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findAllByUserId(Long userId);
    Optional<Budget> findByIdAndUserId(Long id, Long userId);
    boolean existsByUserIdAndMonthAndYear(Long userId, int month, int year);
}
