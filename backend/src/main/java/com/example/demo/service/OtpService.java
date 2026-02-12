package com.example.demo.service;

import com.example.demo.model.Otp;
import com.example.demo.repository.OtpRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class OtpService {

    private final OtpRepository otpRepository;
    private final EmailService emailService;   // ⭐ add this

    // ⭐ inject EmailService
    public OtpService(OtpRepository otpRepository, EmailService emailService) {
        this.otpRepository = otpRepository;
        this.emailService = emailService;
    }

    // Generate and save OTP
    public String generateOtp(String email) {
        // Delete old OTPs for this email (optional - can skip for now)
        // otpRepository.deleteByEmail(email);
        
        String otpCode = String.format("%06d", new Random().nextInt(999999));

        Otp otp = new Otp();
        otp.setEmail(email);
        otp.setOtp(otpCode);
        otp.setExpiryTime(LocalDateTime.now().plusMinutes(5));

        otpRepository.save(otp);

        // ⭐ SEND EMAIL HERE
        emailService.sendOtp(email, otpCode);

        return otpCode;
    }

    // Verify OTP
    public boolean verifyOtp(String email, String otpCode) {
        return otpRepository.findTopByEmailOrderByExpiryTimeDesc(email)
                .filter(otp -> otp.getOtp().equals(otpCode))
                .filter(otp -> otp.getExpiryTime().isAfter(LocalDateTime.now()))
                .isPresent();
    }
}
