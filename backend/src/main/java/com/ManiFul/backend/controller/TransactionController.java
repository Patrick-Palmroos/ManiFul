package com.ManiFul.backend.controller;

import com.ManiFul.backend.model.Transaction;
import com.ManiFul.backend.service.TransactionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
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
    public Transaction createTransaction(@RequestBody Transaction transaction, @AuthenticationPrincipal Jwt jwt) {
        Long userId = jwt.getClaim("id");
        return transactionService.createTransaction(transaction, userId);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteTransaction(@RequestParam Long id, @AuthenticationPrincipal Jwt jwt) {
        Long userId = jwt.getClaim("id");
        transactionService.deleteTransaction(id, userId);
        return ResponseEntity.noContent().build();
    }
}
