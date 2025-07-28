package com.ManiFul.backend.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class BudgetItemDTO {
    private Long categoryId; // optional
    private Long typeId;     // optional
    private BigDecimal amount;
}
