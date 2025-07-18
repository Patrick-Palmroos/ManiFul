package com.ManiFul.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class TransactionItemDTO {
    private String name;
    private BigDecimal total;

    @JsonProperty("type_id") // Maps to "type_id" in JSON
    private Long typeId;

}