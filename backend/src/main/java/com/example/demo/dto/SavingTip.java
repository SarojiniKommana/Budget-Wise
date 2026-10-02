package com.example.demo.dto;

public class SavingTip {
    private String category;
    private String suggestion;
    private double potentialSavings;

    // getters & setters
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getSuggestion() { return suggestion; }
    public void setSuggestion(String suggestion) { this.suggestion = suggestion; }
    public double getPotentialSavings() { return potentialSavings; }
    public void setPotentialSavings(double potentialSavings) { this.potentialSavings = potentialSavings; }
}