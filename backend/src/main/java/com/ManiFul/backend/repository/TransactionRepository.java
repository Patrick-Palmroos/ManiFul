package com.ManiFul.backend.repository;

import com.ManiFul.backend.model.Transaction;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("SELECT t FROM Transaction t LEFT JOIN FETCH t.items WHERE t.id = :id")
    Optional<Transaction> findByIdWithItems(@Param("id") Long id);
}
