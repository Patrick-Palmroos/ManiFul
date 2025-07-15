package com.ManiFul.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
public class TransactionDTO {
    private List<TransactionItemDTO> items;
    private BigDecimal total;
    private String vendor;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private Instant date;
    // Add other fields from your JSON
}