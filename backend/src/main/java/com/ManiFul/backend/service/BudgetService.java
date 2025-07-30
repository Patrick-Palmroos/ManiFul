package com.ManiFul.backend.service;

import com.ManiFul.backend.dto.BudgetDTO;
import com.ManiFul.backend.dto.BudgetItemDTO;
import com.ManiFul.backend.model.*;
import com.ManiFul.backend.repository.*;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final TypeRepository typeRepository;
    private final BudgetMapper budgetMapper;

    @Autowired
    public BudgetService(BudgetRepository budgetRepository,
                         BudgetItemRepository budgetItemRepository,
                         CategoryRepository categoryRepository,
                         TypeRepository typeRepository,
                         BudgetMapper budgetMapper) {
        this.budgetRepository = budgetRepository;
        this.categoryRepository = categoryRepository;
        this.typeRepository = typeRepository;
        this.budgetMapper = budgetMapper;
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

    public List<BudgetDTO> getBudgets(Long userId) {
        return budgetRepository.findAllWithItemsByUserId(userId).stream()
                .map(budgetMapper::toDto)
                .collect(Collectors.toList());
    }

    public BudgetDTO getBudgetById(Long id, Long userId) {
        Budget budget = budgetRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new EntityNotFoundException("Budget not found"));
        return budgetMapper.toDto(budget);
    }

    @Transactional
    public BudgetDTO updateBudget(Long id, BudgetDTO dto, Long userId) {
        Budget budget = budgetRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new EntityNotFoundException("Budget not found or doesn't belong to user"));

        validateBudgetPeriodUniqueness(userId, dto.getMonth(), dto.getYear(), id);

        budget.setMonth(dto.getMonth());
        budget.setYear(dto.getYear());
        budget.setActive(dto.isActive());
        budget.setBudgetTotal(dto.getBudgetTotal());
        budget.setRepeating(dto.isRepeating());

        // Clear existing items efficiently
        budget.getItems().clear();

        // Process new items
        if (dto.getItems() != null && !dto.getItems().isEmpty()) {
            for (BudgetItemDTO itemDTO : dto.getItems()) {
                validateBudgetItem(itemDTO);

                BudgetItem item = BudgetItem.builder()
                        .amount(itemDTO.getAmount())
                        .build();

                if (itemDTO.getTypeId() != null) {
                    Type type = typeRepository.findById(itemDTO.getTypeId())
                            .orElseThrow(() -> new EntityNotFoundException("Type not found with id: " + itemDTO.getTypeId()));
                    item.setType(type);
                } else if (itemDTO.getCategoryId() != null) {
                    Category category = categoryRepository.findById(itemDTO.getCategoryId())
                            .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + itemDTO.getCategoryId()));
                    item.setCategory(category);
                }

                budget.addItem(item);
            }
        }

        Budget updatedBudget = budgetRepository.save(budget);
        return budgetMapper.toDto(updatedBudget);
    }

    private void validateBudgetPeriodUniqueness(Long userId, int month, int year, Long excludeId) {
        if (budgetRepository.existsByUserIdAndMonthAndYearAndIdNot(userId, month, year, excludeId)) {
            throw new IllegalStateException("Budget already exists for this user and month/year combination");
        }
    }

    private void validateBudgetItem(BudgetItemDTO itemDTO) {
        if (itemDTO.getAmount() == null || itemDTO.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Budget item amount must be positive");
        }

        if (itemDTO.getTypeId() == null && itemDTO.getCategoryId() == null) {
            throw new IllegalArgumentException("Budget item must have either type or category");
        }

        if (itemDTO.getTypeId() != null && itemDTO.getCategoryId() != null) {
            throw new IllegalArgumentException("Budget item cannot have both type and category");
        }
    }

    @Transactional
    public void deleteBudget(Long id, Long userId) {
        if (!budgetRepository.existsByIdAndUserId(id, userId)) {
            throw new EntityNotFoundException("Budget not found or doesn't belong to user");
        }
        budgetRepository.deleteById(id);
    }
}