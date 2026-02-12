package com.example.demo.controller;

import com.example.demo.model.Transaction;
import com.example.demo.model.User;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.repository.UserRepository;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.Optional;
import org.springframework.http.ResponseEntity;


import java.util.List;
import java.util.Map;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin // allows requests from frontend
public class TransactionController {

    private final TransactionRepository transactionRepo;
    private final UserRepository userRepo;

    public TransactionController(TransactionRepository transactionRepo, UserRepository userRepo) {
        this.transactionRepo = transactionRepo;
        this.userRepo = userRepo;
    }

    // Save transaction (POST body includes email)
    @PostMapping
    public Transaction save(@RequestBody Map<String, Object> request) {

        // 1️⃣ Get email safely
        Object emailObj = request.get("email");
        if (emailObj == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }
        String email = emailObj.toString().trim();

        // 2️⃣ Find user
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // 3️⃣ Create transaction
        Transaction transaction = new Transaction();
        transaction.setUser(user);

        // Type
        Object typeObj = request.get("type");
        if (typeObj != null) transaction.setType(typeObj.toString());

        // Title
        Object titleObj = request.get("title");
        if (titleObj != null) transaction.setTitle(titleObj.toString());

        // Amount
       /*  Object amountObj = request.get("amount");
        if (amountObj != null) {
            try {
                transaction.setAmount(Double.valueOf(amountObj.toString()));
            } catch (NumberFormatException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount must be a number");
            }
        }*/
       // Amount
Double amt = null;
Object amountObj = request.get("amount");
if (amountObj != null) {
    try {
        amt = Double.valueOf(amountObj.toString());
        if (amt <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount must be positive");
        }
    } catch (NumberFormatException e) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount must be a number");
    }
}

// Expense check
if ("Expense".equalsIgnoreCase(transaction.getType())) {
    Double totalIncome = transactionRepo.sumByUserAndType(user.getId(), "Income");
    Double totalExpense = transactionRepo.sumByUserAndType(user.getId(), "Expense");
    if (totalExpense + amt > totalIncome) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Expense exceeds total income");
    }
}

transaction.setAmount(amt);


        // Date
        Object dateObj = request.get("date");
        if (dateObj != null) {
    // Convert string "YYYY-MM-DD" from frontend to LocalDate
        transaction.setDate(LocalDate.parse(dateObj.toString()));
}
       Object reservedObj = request.get("isReserved");
           if (reservedObj != null) {
    transaction.setReserved(Boolean.parseBoolean(reservedObj.toString()));
}      
        // 4️⃣ Save
        return transactionRepo.save(transaction);
    }

    // Get transactions of logged user (email in query param)
    @GetMapping
    public List<Transaction> getAll(@RequestParam String email) {

        if (email == null || email.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return transactionRepo.findByUserId(user.getId());
    }
    // Update a transaction
@PutMapping("/{id}")
public Transaction update(@PathVariable Long id, @RequestBody Map<String, Object> request) {
    Transaction transaction = transactionRepo.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction not found"));

    Object titleObj = request.get("title");
    if (titleObj != null) transaction.setTitle(titleObj.toString());

    Object amountObj = request.get("amount");
    if (amountObj != null) {
        try {
            Double amt = Double.valueOf(amountObj.toString());
            if (amt <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount must be positive");
            }
            // Optional: check Expense limit like before
            transaction.setAmount(amt);
        } catch (NumberFormatException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount must be a number");
        }
    }

    Object dateObj = request.get("date");
    if (dateObj != null) transaction.setDate(LocalDate.parse(dateObj.toString()));

    Object reservedObj = request.get("isReserved");
    if (reservedObj != null) transaction.setReserved(Boolean.parseBoolean(reservedObj.toString()));

    return transactionRepo.save(transaction);
}

// Delete a transaction
@DeleteMapping("/{id}")
public void delete(@PathVariable Long id) {
    if (!transactionRepo.existsById(id)) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction not found");
    }
    transactionRepo.deleteById(id);
}

}
