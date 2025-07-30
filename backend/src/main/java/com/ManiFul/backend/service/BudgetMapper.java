package com.ManiFul.backend.service;

import com.ManiFul.backend.dto.BudgetDTO;
import com.ManiFul.backend.dto.BudgetItemDTO;
import com.ManiFul.backend.model.Budget;
import com.ManiFul.backend.model.BudgetItem;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class BudgetMapper {

    public BudgetDTO toDto(Budget budget) {
        return BudgetDTO.builder()
                .month(budget.getMonth())
                .year(budget.getYear())
                .active(budget.isActive())
                .budgetTotal(budget.getBudgetTotal())
                .repeating(budget.isRepeating())
                .items(budget.getItems().stream()
                        .map(this::toItemDto)
                        .collect(Collectors.toList()))
                .build();
    }

    public BudgetItemDTO toItemDto(BudgetItem item) {
        BudgetItemDTO dto = new BudgetItemDTO();
        dto.setAmount(item.getAmount());
        if (item.getCategory() != null) {
            dto.setCategoryId(item.getCategory().getId());
        }
        if (item.getType() != null) {
            dto.setTypeId(item.getType().getId());
        }
        return dto;
    }
}