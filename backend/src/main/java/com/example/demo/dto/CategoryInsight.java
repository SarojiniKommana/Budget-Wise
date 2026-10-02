package com.example.demo.dto;

public class CategoryInsight {
    private String category;
    private double currentAmount;
    private Double changePercent; // nullable — null if no last-month data
    private String message;

    // getters & setters
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public double getCurrentAmount() { return currentAmount; }
    public void setCurrentAmount(double currentAmount) { this.currentAmount = currentAmount; }
    public Double getChangePercent() { return changePercent; }
    public void setChangePercent(Double changePercent) { this.changePercent = changePercent; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}