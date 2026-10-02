package com.example.demo.repository;

import com.example.demo.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserId(Long userId);
     @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user.id = :userId AND t.type = :type")
    Double sumByUserAndType(@Param("userId") Long userId, @Param("type") String type);

    @Query("""
        SELECT t FROM Transaction t
        WHERE t.user.id = :userId
        AND (:startDate IS NULL OR t.date >= :startDate)
        AND (:endDate IS NULL OR t.date <= :endDate)
        AND (:category IS NULL OR LOWER(t.title) = LOWER(:category))
        AND (:type IS NULL OR LOWER(t.type) = LOWER(:type))
        ORDER BY t.date DESC
        """)
    List<Transaction> findFiltered(
        @Param("userId") Long userId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        @Param("category") String category,
        @Param("type") String type
    );
}
