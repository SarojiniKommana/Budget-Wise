package com.example.demo.controller;

import com.example.demo.dto.InsightResponse;
import com.example.demo.model.Transaction;
import com.example.demo.model.User;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AiInsightService;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.YearMonth;
import java.util.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin
public class AiInsightController {

    private final TransactionRepository transactionRepo;
    private final UserRepository userRepo;
    private final AiInsightService aiService;

    public AiInsightController(TransactionRepository transactionRepo,
                                UserRepository userRepo,
                                AiInsightService aiService) {
        this.transactionRepo = transactionRepo;
        this.userRepo = userRepo;
        this.aiService = aiService;
    }

    @GetMapping("/insights")
    public InsightResponse getInsights(@RequestParam String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        List<Transaction> list = transactionRepo.findByUserId(user.getId());
        if (list == null || list.isEmpty()) {
            return InsightResponse.empty("No transactions found for this user.");
        }

        YearMonth currentMonth = YearMonth.now();
        YearMonth lastMonth = currentMonth.minusMonths(1);

        Map<String, Double> currentCategoryTotals = new HashMap<>();
        Map<String, Double> lastCategoryTotals = new HashMap<>();
        double income = 0, currentExpense = 0, lastExpense = 0;

        for (Transaction t : list) {
            if (t.getDate() == null) continue;
            YearMonth txMonth = YearMonth.from(t.getDate());

            if ("Income".equalsIgnoreCase(t.getType()) && txMonth.equals(currentMonth)) {
                income += t.getAmount();
            }

            if ("Expense".equalsIgnoreCase(t.getType())) {
                if (txMonth.equals(currentMonth)) {
                    currentExpense += t.getAmount();
                    currentCategoryTotals.merge(t.getTitle(), t.getAmount(), Double::sum);
                } else if (txMonth.equals(lastMonth)) {
                    lastExpense += t.getAmount();
                    lastCategoryTotals.merge(t.getTitle(), t.getAmount(), Double::sum);
                }
            }
        }

        if (currentCategoryTotals.isEmpty()) {
            return InsightResponse.empty("No transactions recorded for this month yet.");
        }

        String prompt = aiService.buildInsightPrompt(income, currentExpense, lastExpense,
                currentCategoryTotals, lastCategoryTotals);

        try {
            return aiService.generateStructuredInsights(prompt);
        } catch (Exception e) {
            e.printStackTrace();
            return InsightResponse.empty("AI service failed. Please try again later.");
        }
    }
}