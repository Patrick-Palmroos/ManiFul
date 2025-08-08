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
    private Long id;
    private Integer month;
    private Integer year;
    private boolean active;
    private BigDecimal budgetTotal;
    private boolean repeating;
    private List<BudgetItemDTO> items;
}