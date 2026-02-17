package com.example.demo.controller;

import com.example.demo.model.Transaction;
import com.example.demo.model.User;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AiInsightService;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@RestController
@RequestMapping("/api/ai")   // 🔥 separate base path
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
    public String getInsights(@RequestParam String email) {
        System.out.println("Controller reached with email = " + email);
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        List<Transaction> list = transactionRepo.findByUserId(user.getId());
         if (list == null || list.isEmpty()) {
         return "No transactions found for this user.";
         }
        double income = 0;
        double expense = 0;

        Map<String, Double> categoryTotals = new HashMap<>();

        for (Transaction t : list) {

            if ("Income".equalsIgnoreCase(t.getType()))
                income += t.getAmount();

            if ("Expense".equalsIgnoreCase(t.getType())) {
                expense += t.getAmount();
                categoryTotals.merge(t.getTitle(), t.getAmount(), Double::sum);
            }
        }

        StringBuilder categories = new StringBuilder();
        categoryTotals.forEach((k, v) ->
                categories.append(k).append(": ").append(v).append("\n")
        );

        String prompt = """
        You are a smart financial advisor.

        Income: %f
        Expense: %f

        Category breakdown:
        %s

        Give 3 insights and 2 saving tips in bullets.
        """.formatted(income, expense, categories.toString());

        try {
            return aiService.generateInsights(prompt);
        } catch (Exception e) {
            e.printStackTrace();
            return "AI service failed: " + e.getMessage();
        }

    }
}
