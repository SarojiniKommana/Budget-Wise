package com.example.demo.repository;

import com.example.demo.model.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface OtpRepository extends JpaRepository<Otp, Long> {

    // get latest OTP for email
    Optional<Otp> findTopByEmailOrderByExpiryTimeDesc(String email);

    // delete old OTPs
    @Modifying
    @Transactional
    void deleteByEmail(String email);
}
