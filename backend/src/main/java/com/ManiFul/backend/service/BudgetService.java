package com.ManiFul.backend.service;

import com.ManiFul.backend.dto.BudgetDTO;
import com.ManiFul.backend.dto.BudgetItemDTO;
import com.ManiFul.backend.model.*;
import com.ManiFul.backend.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final TypeRepository typeRepository;

    @Autowired
    public BudgetService(BudgetRepository budgetRepository,
                         BudgetItemRepository budgetItemRepository,
                         CategoryRepository categoryRepository,
                         TypeRepository typeRepository) {
        this.budgetRepository = budgetRepository;
        this.categoryRepository = categoryRepository;
        this.typeRepository = typeRepository;
    }

    @Transactional
    public Budget createBudget(BudgetDTO dto, Long userId) {
        if (budgetRepository.existsByUserIdAndMonthAndYear(userId, dto.getMonth(), dto.getYear())) {
            throw new RuntimeException("Budget already exists for this user and month/year");
        }

        Budget budget = Budget.builder()
                .userId(userId)
                .month(dto.getMonth())
                .year(dto.getYear())
                .active(dto.isActive())
                .budgetTotal(dto.getBudgetTotal())
                .repeating(dto.isRepeating())
                .build();

        if (dto.getItems() != null) {
            for (BudgetItemDTO itemDTO : dto.getItems()) {
                BudgetItem item = new BudgetItem();
                item.setAmount(itemDTO.getAmount());

                if (itemDTO.getTypeId() != null) {
                    Type type = typeRepository.findById(itemDTO.getTypeId())
                            .orElseThrow(() -> new RuntimeException("Type not found: " + itemDTO.getTypeId()));
                                    item.setType(type);
                } else if (itemDTO.getCategoryId() != null) {
                    Category category = categoryRepository.findById(itemDTO.getCategoryId())
                            .orElseThrow(() -> new RuntimeException("Category not found: " + itemDTO.getCategoryId()));
                                    item.setCategory(category);
                }

                budget.addItem(item);
            }
        }

        return budgetRepository.save(budget);
    }

    public List<Budget> getBudgets(Long userId) {
        return budgetRepository.findAllByUserId(userId);
    }

    public Budget getBudgetById(Long id, Long userId) {
        return budgetRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Budget not found or doesn't belong to user"));
    }

    @Transactional
    public Budget updateBudget(Long id, BudgetDTO dto, Long userId) {
        Budget budget = getBudgetById(id, userId);
        budget.setActive(dto.isActive());
        budget.setBudgetTotal(dto.getBudgetTotal());
        budget.setRepeating(dto.isRepeating());

        budget.getItems().clear(); // remove old items

        if (dto.getItems() != null) {
            for (BudgetItemDTO itemDTO : dto.getItems()) {
                BudgetItem item = new BudgetItem();
                item.setAmount(itemDTO.getAmount());

                if (itemDTO.getTypeId() != null) {
                    Type type = typeRepository.findById(itemDTO.getTypeId())
                            .orElseThrow(() -> new RuntimeException("Type not found: " + itemDTO.getTypeId()));
                                    item.setType(type);
                } else if (itemDTO.getCategoryId() != null) {
                    Category category = categoryRepository.findById(itemDTO.getCategoryId())
                            .orElseThrow(() -> new RuntimeException("Category not found: " + itemDTO.getCategoryId()));
                                    item.setCategory(category);
                }

                budget.addItem(item);
            }
        }

        return budgetRepository.save(budget);
    }

    public void deleteBudget(Long id, Long userId) {
        Budget budget = getBudgetById(id, userId);
        budgetRepository.delete(budget);
    }
}