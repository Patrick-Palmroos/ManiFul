package com.ManiFul.backend.controller;

import com.ManiFul.backend.model.Transaction;
import com.ManiFul.backend.service.TransactionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    @Autowired
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping("/getById")
    public Transaction getTransactionWithItems(@RequestParam Long id) {
        return transactionService.getTransactionWithItems(id);
    }

    @GetMapping("/getAll")
    public List<Transaction> getAllTransactions(@AuthenticationPrincipal Jwt jwt) {
        Long userId = jwt.getClaim("id");
        return transactionService.getAllTransactions(userId);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createTransaction(@RequestBody Transaction transaction, @AuthenticationPrincipal Jwt jwt) {
        try {
            Long userId = jwt.getClaim("id");
            Transaction saved = transactionService.createTransaction(transaction, userId);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            // Log the error and return a 500 with message
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating transaction: " + e.getMessage());
        }
    }
}
