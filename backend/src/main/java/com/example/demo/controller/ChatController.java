package com.example.demo.controller;

import com.example.demo.model.ChatMessage;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.ChatService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin
public class ChatController {

    private final ChatService chatService;
    private final UserRepository userRepo;

    public ChatController(ChatService chatService, UserRepository userRepo) {
        this.chatService = chatService;
        this.userRepo = userRepo;
    }

    @GetMapping("/history")
    public List<ChatMessage> getHistory(@RequestParam String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return chatService.getHistory(user);
    }

    @PostMapping("/message")
    public ChatMessage sendMessage(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String message = body.get("message");

        if (email == null || message == null || message.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "email and message are required");
        }

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return chatService.sendMessage(user, message);
    }
}