package com.example.demo.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;   // ✅ add name

    @Column(unique = true)
    private String email;

    private String password; // hashed

    // ===== Getters & Setters =====

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    @JsonIgnore
    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }
}
