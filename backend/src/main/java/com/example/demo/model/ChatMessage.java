package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* ---------------- USER RELATION ---------------- */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /* ---------------- DATA ---------------- */
    private String role; // "user" or "assistant"

    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime timestamp;

    /* ---------------- CONSTRUCTORS ---------------- */
    public ChatMessage() {}

    public ChatMessage(User user, String role, String content, LocalDateTime timestamp) {
        this.user = user;
        this.role = role;
        this.content = content;
        this.timestamp = timestamp;
    }

    /* ---------------- GETTERS & SETTERS ---------------- */

    public Long getId() { return id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}