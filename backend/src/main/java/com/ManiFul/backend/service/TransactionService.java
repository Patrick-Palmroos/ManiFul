package com.ManiFul.backend.service;

import com.ManiFul.backend.dto.TransactionDTO;
import com.ManiFul.backend.dto.TransactionItemDTO;
import com.ManiFul.backend.model.Transaction;
import com.ManiFul.backend.model.TransactionItem;
import com.ManiFul.backend.model.Type;
import com.ManiFul.backend.repository.TransactionRepository;
import com.ManiFul.backend.repository.TypeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
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
        return transactionRepository.findTransactionsByUserId(userId);
    }

    @Transactional
    public Transaction createTransaction(TransactionDTO transactionDTO, Long userId) {
        // Create new transaction using builder pattern
        Transaction transaction = Transaction.builder()
                .date(transactionDTO.getDate())
                .total(transactionDTO.getTotal())
                .vendor(transactionDTO.getVendor())
                .userId(userId)
                .build();

        // Process items if present
        if (transactionDTO.getItems() != null && !transactionDTO.getItems().isEmpty()) {
            for (TransactionItemDTO itemDTO : transactionDTO.getItems()) {
                TransactionItem item = TransactionItem.builder()
                        .name(itemDTO.getName())
                        .total(itemDTO.getTotal())
                        .build();

                // Handle type association
                if (itemDTO.getTypeId() != null) {
                    Type type = typeRepository.findById(itemDTO.getTypeId())
                            .orElseThrow(() -> new RuntimeException("Type not found with id " + itemDTO.getTypeId()));

                    // Verify type belongs to user
                    if (!type.getUserId().equals(userId)) {
                        throw new RuntimeException("Type does not belong to user");
                    }
                    item.setType(type);
                }

                // Add item to transaction
                transaction.addItem(item);
            }
        }

        return transactionRepository.save(transaction);
    }

    @Transactional
    public void deleteTransaction(Long transactionId, Long userId) {
        // Verify the transaction exists and belongs to the user
        if (!transactionRepository.existsByIdAndUserId(transactionId, userId)) {
            throw new RuntimeException("Transaction not found or doesn't belong to user");
        }

        // Automatically delete all associated items due to the cascade
        transactionRepository.deleteById(transactionId);
    }
}
