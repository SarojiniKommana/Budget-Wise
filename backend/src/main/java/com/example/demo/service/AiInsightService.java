package com.example.demo.service;

import com.example.demo.dto.InsightResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;

import java.util.*;

@Service
public class AiInsightService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String buildInsightPrompt(double income, double currentExpense, double lastExpense,
                                      Map<String, Double> current, Map<String, Double> last) {
        return """
        You are a financial advisor analyzing ONE user's monthly spending.

        This month income: %.2f
        This month expense: %.2f
        Last month expense: %.2f

        This month by category:
        %s

        Last month by category:
        %s

        Return ONLY valid JSON in this exact structure:
        {
          "summary": "one sentence overall summary comparing this month to last month",
          "insights": [
            {"category": "string", "currentAmount": number, "changePercent": number or null, "message": "specific observation using real numbers"}
          ],
          "tips": [
            {"category": "string", "suggestion": "specific actionable tip", "potentialSavings": number}
          ]
        }

        Rules:
        - Only include categories with actual data this month.
        - changePercent must be calculated from the real numbers given. If a category has no last-month data, set changePercent to null and say it's new in the message.
        - Every tip must reference a real number from the data. No generic advice like "consult a financial advisor" or "track your spending more".
        - insights and tips arrays should have at most 4 items each, prioritizing the categories with the biggest amounts or changes.
        """.formatted(income, currentExpense, lastExpense, formatMap(current), formatMap(last));
    }

    private String formatMap(Map<String, Double> map) {
        if (map.isEmpty()) return "(none)";
        StringBuilder sb = new StringBuilder();
        map.forEach((k, v) -> sb.append(k).append(": ").append(v).append("\n"));
        return sb.toString();
    }

    public InsightResponse generateStructuredInsights(String prompt) throws Exception {
        String url =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                ),
                "generationConfig", Map.of(
                        "responseMimeType", "application/json"
                )
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        String rawText = extractTextFromGeminiResponse(response.getBody());

        // Safety net in case the model still wraps it in markdown fences
        String cleaned = rawText.trim()
                .replaceAll("^```json", "")
                .replaceAll("^```", "")
                .replaceAll("```$", "")
                .trim();

        try {
            return objectMapper.readValue(cleaned, InsightResponse.class);
        } catch (Exception parseError) {
            parseError.printStackTrace();
            return InsightResponse.empty("Could not parse AI insights. Please try again.");
        }
    }

    private String extractTextFromGeminiResponse(String responseBody) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);
        return root.path("candidates").get(0)
                   .path("content").path("parts").get(0)
                   .path("text").asText();
    }
}