package com.ManiFul.backend.repository;

import com.ManiFul.backend.model.BudgetItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetItemRepository extends JpaRepository<BudgetItem, Long> {
}
