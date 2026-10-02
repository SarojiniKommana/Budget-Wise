package com.example.demo.service;

import com.example.demo.model.ChatMessage;
import com.example.demo.model.Transaction;
import com.example.demo.model.User;
import com.example.demo.repository.ChatMessageRepository;
import com.example.demo.repository.TransactionRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final TransactionRepository transactionRepo;
    private final ChatMessageRepository chatRepo;

    public ChatService(TransactionRepository transactionRepo, ChatMessageRepository chatRepo) {
        this.transactionRepo = transactionRepo;
        this.chatRepo = chatRepo;
    }

    public List<ChatMessage> getHistory(User user) {
        return chatRepo.findByUserIdOrderByTimestampAsc(user.getId());
    }

    public ChatMessage sendMessage(User user, String userMessage) {
        ChatMessage userMsg = new ChatMessage(user, "user", userMessage, LocalDateTime.now());
        chatRepo.save(userMsg);

        List<ChatMessage> history = chatRepo.findByUserIdOrderByTimestampAsc(user.getId());

        try {
            String replyText = callGeminiWithTools(user, history);
            ChatMessage assistantMsg = new ChatMessage(user, "assistant", replyText, LocalDateTime.now());
            return chatRepo.save(assistantMsg);
        } catch (Exception e) {
            e.printStackTrace();
            ChatMessage errorMsg = new ChatMessage(user, "assistant",
                "Sorry, I couldn't process that right now. Please try again.", LocalDateTime.now());
            return chatRepo.save(errorMsg);
        }
    }

    private String callGeminiWithTools(User user, List<ChatMessage> history) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

        List<Map<String, Object>> contents = buildContents(history);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", contents);
        requestBody.put("tools", List.of(getTransactionTool()));
        requestBody.put("systemInstruction", Map.of(
            "parts", List.of(Map.of("text", systemPrompt()))
        ));

        JsonNode responseNode = postToGemini(url, requestBody);
        JsonNode firstPart = responseNode.path("candidates").get(0).path("content").path("parts").get(0);

        if (firstPart.has("functionCall")) {
            JsonNode functionCall = firstPart.path("functionCall");
            String functionName = functionCall.path("name").asText();
            JsonNode args = functionCall.path("args");

            Map<String, Object> functionResult = executeFunction(user, functionName, args);

            contents.add(Map.of(
                "role", "model",
                "parts", List.of(Map.of("functionCall", objectMapper.convertValue(functionCall, Map.class)))
            ));
            contents.add(Map.of(
                "role", "function",
                "parts", List.of(Map.of(
                    "functionResponse", Map.of(
                        "name", functionName,
                        "response", functionResult
                    )
                ))
            ));

            Map<String, Object> secondRequestBody = new HashMap<>();
            secondRequestBody.put("contents", contents);
            secondRequestBody.put("tools", List.of(getTransactionTool()));
            secondRequestBody.put("systemInstruction", Map.of(
                "parts", List.of(Map.of("text", systemPrompt()))
            ));

            JsonNode secondResponse = postToGemini(url, secondRequestBody);
            return secondResponse.path("candidates").get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asText();
        }

        return firstPart.path("text").asText();
    }

    private JsonNode postToGemini(String url, Map<String, Object> body) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
        return objectMapper.readTree(response.getBody());
    }

    private List<Map<String, Object>> buildContents(List<ChatMessage> history) {
        List<Map<String, Object>> contents = new ArrayList<>();
        for (ChatMessage msg : history) {
            String role = "user".equals(msg.getRole()) ? "user" : "model";
            contents.add(Map.of(
                "role", role,
                "parts", List.of(Map.of("text", msg.getContent()))
            ));
        }
        return contents;
    }

    private String systemPrompt() {
        return """
        You are a helpful financial assistant inside a budget tracking app called BudgetWise.
        You can answer questions about the user's actual transaction data using the getTransactionSummary tool,
        and you can also give general financial/budgeting advice.

        Rules:
        - When the user asks anything about their spending, income, or specific categories, ALWAYS call getTransactionSummary first rather than guessing.
        - When giving general advice, be specific and practical, not generic.
        - Keep responses concise (2-4 sentences unless the user asks for detail).
        - Use ₹ for currency.
        - Today's date is %s.
        """.formatted(LocalDate.now());
    }

    private Map<String, Object> executeFunction(User user, String functionName, JsonNode args) {
        if (!"getTransactionSummary".equals(functionName)) {
            return Map.of("error", "Unknown function");
        }

        LocalDate startDate = args.hasNonNull("startDate") ? LocalDate.parse(args.get("startDate").asText()) : null;
        LocalDate endDate = args.hasNonNull("endDate") ? LocalDate.parse(args.get("endDate").asText()) : null;
        String category = args.hasNonNull("category") ? args.get("category").asText() : null;
        String type = args.hasNonNull("type") ? args.get("type").asText() : null;

        List<Transaction> results = transactionRepo.findFiltered(user.getId(), startDate, endDate, category, type);

        double total = results.stream().mapToDouble(Transaction::getAmount).sum();
        int count = results.size();

        Map<String, Double> byCategory = results.stream()
            .collect(Collectors.groupingBy(Transaction::getTitle, Collectors.summingDouble(Transaction::getAmount)));

        Map<String, Object> result = new HashMap<>();
        result.put("totalAmount", total);
        result.put("transactionCount", count);
        result.put("categoryBreakdown", byCategory);
        return result;
    }

    private Map<String, Object> getTransactionTool() {
        return Map.of(
            "functionDeclarations", List.of(
                Map.of(
                    "name", "getTransactionSummary",
                    "description", "Get the total amount, transaction count, and category breakdown for the user's transactions, optionally filtered by date range, category, and type (Income or Expense). Use this whenever the user asks about their spending, income, or specific categories.",
                    "parameters", Map.of(
                        "type", "OBJECT",
                        "properties", Map.of(
                            "startDate", Map.of("type", "STRING", "description", "Start date in YYYY-MM-DD format. Omit if not specified."),
                            "endDate", Map.of("type", "STRING", "description", "End date in YYYY-MM-DD format. Omit if not specified."),
                            "category", Map.of("type", "STRING", "description", "Category name e.g. Food, Transport, Rent. Omit to include all categories."),
                            "type", Map.of("type", "STRING", "description", "Either 'Income' or 'Expense'. Omit to include both.")
                        )
                    )
                )
            )
        );
    }
}