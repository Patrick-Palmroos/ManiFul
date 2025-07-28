package com.ManiFul.backend.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class BudgetDTO {
    private int month;
    private int year;
    private boolean active;
    private BigDecimal budgetTotal;
    private boolean repeating;
    private List<BudgetItemDTO> items;
}