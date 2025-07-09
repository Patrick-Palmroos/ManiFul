package com.ManiFul.backend.service;

import com.ManiFul.backend.model.Transaction;
import com.ManiFul.backend.model.Type;
import com.ManiFul.backend.repository.TransactionRepository;
import com.ManiFul.backend.repository.TypeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import jakarta.transaction.Transactional;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final TypeRepository typeRepository;

    @Autowired
    public TransactionService(TransactionRepository transactionRepository, TypeRepository typeRepository) {
        this.transactionRepository = transactionRepository;
        this.typeRepository = typeRepository;
    }

    @Transactional
    public Transaction getTransactionWithItems(Long transactionId) {
        Optional<Transaction> transactionOpt = transactionRepository.findByIdWithItems(transactionId);
        Transaction transaction = transactionOpt.orElseThrow(() -> new RuntimeException(("Transaction not found with id " + transactionId)));

        // Load types for each item if they exist
        transaction.getItems().forEach(item -> {
            if (item.getType() != null) {
                item.setType(typeRepository.findById(item.getType().getId()).orElse(null));
            }
        });

        return transaction;
    }

    @Transactional
    public List<Transaction> getAllTransactions(Long userId) {
        List<Transaction> transactions = transactionRepository.findTransactionsByUserId(userId);

        // Load types for all items
        transactions.forEach(transaction ->
                transaction.getItems().forEach(item -> {
                    if (item.getType() != null) {
                        item.setType(typeRepository.findById(item.getType().getId()).orElse(null));
                    }
                })
        );

        return transactions;
    }

    @Transactional
    public Transaction createTransaction(Transaction transaction, Long userId) {
        transaction.setUserId(userId);

        if (transaction.getItems() != null) {
            transaction.getItems().forEach(item -> {
                item.setTransaction(transaction);
                if (item.getType() != null && item.getType().getId() != null) {
                    // Ensure the type exists and belongs to the user
                    Type type = typeRepository.findById(item.getType().getId())
                            .orElseThrow(() -> new RuntimeException("Type not found with id " + item.getType().getId()));
                    if (!type.getUserId().equals(userId)) {
                        throw new RuntimeException("Type does not belong to user");
                    }
                    item.setType(type);
                }
            });
        }

        return transactionRepository.save(transaction);
    }
}
