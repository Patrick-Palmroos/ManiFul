package com.ManiFul.backend.repository;

import com.ManiFul.backend.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findAllByUserId(Long userId);
    Optional<Budget> findByIdAndUserId(Long id, Long userId);
    boolean existsByUserIdAndMonthAndYear(Long userId, int month, int year);

    boolean existsByIdAndUserId(Long id, Long userId);

    @Query("SELECT b FROM Budget b LEFT JOIN FETCH b.items WHERE b.userId = :userId")
    List<Budget> findAllWithItemsByUserId(@Param("userId") Long userId);

    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END " +
            "FROM Budget b " +
            "WHERE b.userId = :userId " +
            "AND b.month = :month " +
            "AND b.year = :year " +
            "AND b.id <> :excludeId")
    boolean existsByUserIdAndMonthAndYearAndIdNot(
            @Param("userId") Long userId,
            @Param("month") int month,
            @Param("year") int year,
            @Param("excludeId") Long excludeId);
}
