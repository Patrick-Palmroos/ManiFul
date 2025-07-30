package com.ManiFul.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BudgetItemDTO {
    private Long categoryId; // optional
    private Long typeId;     // optional
    private BigDecimal amount;
}
