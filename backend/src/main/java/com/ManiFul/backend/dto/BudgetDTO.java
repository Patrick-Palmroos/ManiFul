package com.ManiFul.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BudgetDTO {
    private int month;
    private int year;
    private boolean active;
    private BigDecimal budgetTotal;
    private boolean repeating;
    private List<BudgetItemDTO> items;
}