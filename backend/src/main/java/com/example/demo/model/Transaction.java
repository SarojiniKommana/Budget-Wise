package com.example.demo.model;


import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* ---------------- USER RELATION ---------------- */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /* ---------------- DATA ---------------- */
    private String type; // INCOME or EXPENSE

    private String title; // category or name

    private Double amount;

    private LocalDate date;

    private boolean isReserved;

    /* ---------------- CONSTRUCTORS ---------------- */
    public Transaction() {}

    /* ---------------- GETTERS & SETTERS ---------------- */

    public Long getId() { return id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public boolean isReserved() { return isReserved; }
    public void setReserved(boolean reserved) { isReserved = reserved; }
}
