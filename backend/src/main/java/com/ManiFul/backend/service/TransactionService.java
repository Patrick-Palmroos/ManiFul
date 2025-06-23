package com.ManiFul.backend.service;

import com.ManiFul.backend.model.Transaction;
import com.ManiFul.backend.repository.TransactionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    @Autowired
    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public Transaction getTransactionWithItems(Long transactionId) {
        Optional<Transaction> transactionOpt = transactionRepository.findByIdWithItems(transactionId);
        return transactionOpt.orElseThrow(() -> new RuntimeException(("Transaction not found with id " + transactionId)));
    }
}
