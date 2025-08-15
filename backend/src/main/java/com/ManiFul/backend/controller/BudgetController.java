package com.ManiFul.backend.controller;

import com.ManiFul.backend.dto.BudgetDTO;
import com.ManiFul.backend.model.Budget;
import com.ManiFul.backend.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    @Autowired
    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @PostMapping("/create")
    public Budget createBudget(@RequestBody BudgetDTO budgetDTO, @AuthenticationPrincipal Jwt jwt) {
        Long userId = jwt.getClaim("id");
        return budgetService.createBudget(budgetDTO, userId);
    }

    @GetMapping("/getAll")
    public List<BudgetDTO> getBudgets(@AuthenticationPrincipal Jwt jwt) {
        Long userId = jwt.getClaim("id");
        return budgetService.getBudgets(userId);
    }

    @GetMapping("/getById")
    public BudgetDTO getBudgetById(@RequestParam Long id, @AuthenticationPrincipal Jwt jwt) {
        Long userId = jwt.getClaim("id");
        return budgetService.getBudgetById(id, userId);
    }

    @PutMapping("/update")
    public BudgetDTO updateBudget(@RequestParam Long id, @RequestBody BudgetDTO budgetDTO, @AuthenticationPrincipal Jwt jwt) {
        Long userId = jwt.getClaim("id");
        return budgetService.updateBudget(id, budgetDTO, userId);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteBudget(@RequestParam Long id, @AuthenticationPrincipal Jwt jwt) {
        Long userId = jwt.getClaim("id");
        budgetService.deleteBudget(id, userId);
        return ResponseEntity.noContent().build();
    }
}
