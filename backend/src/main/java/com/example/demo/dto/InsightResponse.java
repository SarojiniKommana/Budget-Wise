package com.example.demo.dto;

import java.util.List;

public class InsightResponse {
    private String summary;
    private List<CategoryInsight> insights;
    private List<SavingTip> tips;

    public static InsightResponse empty(String message) {
        InsightResponse r = new InsightResponse();
        r.summary = message;
        r.insights = List.of();
        r.tips = List.of();
        return r;
    }

    // getters & setters
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public List<CategoryInsight> getInsights() { return insights; }
    public void setInsights(List<CategoryInsight> insights) { this.insights = insights; }
    public List<SavingTip> getTips() { return tips; }
    public void setTips(List<SavingTip> tips) { this.tips = tips; }
}