package com.example.demo.controller;

import com.example.demo.service.OtpService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.repository.UserRepository;
import com.example.demo.model.User;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.HashMap;
import java.util.Map;
import com.example.demo.controller.dto.VerifyRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@RestController


@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final OtpService otpService;
    private final UserRepository userRepo;
    private final BCryptPasswordEncoder encoder;

   public AuthController(OtpService otpService,
                      UserRepository userRepo,
                      BCryptPasswordEncoder encoder) {
    this.otpService = otpService;
    this.userRepo = userRepo;
    this.encoder = encoder;
}


    // Endpoint to register user
    @PostMapping("/register")
    public Map<String, String> register(@RequestBody VerifyRequest req) {
        return verifyOtp(req);
    }

    // Endpoint to send forgot password OTP
    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.trim().isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Email is required");
            return response;
        }
        
        String otp = otpService.generateOtp(email);
        Map<String, String> response = new HashMap<>();
        response.put("message", "OTP sent to your email");
        response.put("otp", otp);
        return response;
    }

    // Endpoint to verify reset OTP (separate verification before password change)
    @PostMapping("/verify-reset-otp")
    public Map<String, String> verifyResetOtp(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String otp = request.get("otp");
            
            if (email == null || email.trim().isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Email is required");
                return response;
            }
            
            if (otp == null || otp.trim().isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "OTP is required");
                return response;
            }
            
            String trimmedOtp = otp.trim();
            boolean isValid = otpService.verifyOtp(email, trimmedOtp);
            
            Map<String, String> response = new HashMap<>();
            if (isValid) {
                logger.info("OTP verified successfully for: {}", email);
                response.put("message", "OTP verified successfully");
            } else {
                logger.warn("Invalid or expired OTP for: {}", email);
                response.put("message", "Invalid or expired OTP");
            }
            
            return response;
        } catch (Exception e) {
            logger.error("Error in verifyResetOtp endpoint", e);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Server error: " + e.getMessage());
            return response;
        }
    }

    // Endpoint to reset password (OTP already verified separately)
    @PostMapping("/reset-password")
    public Map<String, String> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");
            
            if (email == null || email.trim().isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Email is required");
                return response;
            }
            
            if (password == null || password.trim().isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "New password is required");
                return response;
            }
            
            User user = userRepo.findByEmail(email).orElse(null);
            if (user != null) {
                user.setPassword(encoder.encode(password));
                userRepo.save(user);
                logger.info("Password reset successfully for: {}", email);
                Map<String, String> response = new HashMap<>();
                response.put("message", "Password reset successfully");
                return response;
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "User not found");
                return response;
            }
        } catch (Exception e) {
            logger.error("Error in resetPassword endpoint", e);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Server error: " + e.getMessage());
            return response;
        }
    }

    // Endpoint to generate OTP
    @PostMapping("/generate-otp")
public Map<String, String> generateOtp(@RequestBody Map<String, String> request) {
    String email = request.get("email");
    
    if (email == null || email.trim().isEmpty()) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Email is required");
        return response;
    }
    
    // Check if user already exists
    if (userRepo.findByEmail(email).isPresent()) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "User already exists with this email");
        return response;
    }

    String otp = otpService.generateOtp(email);

    Map<String, String> response = new HashMap<>();
    response.put("message", "OTP generated successfully");
    response.put("otp", otp);  // Remove in production
    return response;
}

 @PostMapping("/login")
public Map<String, String> login(@RequestBody Map<String, String> request) {
    String email = request.get("email");
    String password = request.get("password");
    
    if (email == null || email.trim().isEmpty()) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Email is required");
        return response;
    }
    
    if (password == null || password.trim().isEmpty()) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Password is required");
        return response;
    }
    
    var user = userRepo.findByEmail(email);
    if (user.isPresent() && encoder.matches(password, user.get().getPassword())) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("name", user.get().getName());
        response.put("email", user.get().getEmail());
        return response;
    } else {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Invalid email or password");
        return response;
    }
}
    // Endpoint to verify OTP
   @PostMapping("/verify-otp")
public Map<String, String> verifyOtp(@RequestBody VerifyRequest req) {
    try {
        logger.info("Verify OTP request: email={}, otp={}", req.getEmail(), req.getOtp());

        if (req.getEmail() == null || req.getEmail().trim().isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Email is required");
            return response;
        }

        if (req.getOtp() == null || req.getOtp().trim().isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "OTP is required");
            return response;
        }

        if (req.getPassword() == null || req.getPassword().trim().isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Password is required");
            return response;
        }

        if (req.getName() == null || req.getName().trim().isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Name is required");
            return response;
        }

        // Check if user already exists
        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User already exists with this email");
            logger.warn("Registration attempt with existing email: {}", req.getEmail());
            return response;
        }

        // Trim OTP in case of whitespace
        String trimmedOtp = req.getOtp().trim();
        boolean isValid = otpService.verifyOtp(req.getEmail(), trimmedOtp);

        logger.info("OTP verification result: {}", isValid);

        Map<String, String> response = new HashMap<>();

        if (isValid) {
             User user = new User();
            user.setName(req.getName());
            user.setEmail(req.getEmail());
            user.setPassword(encoder.encode(req.getPassword()));

            userRepo.save(user);
            logger.info("User registered successfully: {}", req.getEmail());
            response.put("message", "OTP verified successfully");
        } else {
            logger.warn("Invalid or expired OTP for email: {}", req.getEmail());
            response.put("message", "Invalid or expired OTP");
        }

        return response;
    } catch (Exception e) {
        logger.error("Error in verifyOtp endpoint", e);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Server error: " + e.getMessage());
        return response;
    }
}
  @PostMapping("/change-password")
public Map<String, String> changePassword(@RequestBody Map<String, String> req) {

    String email = req.get("email");
    String oldPassword = req.get("oldPassword");
    String newPassword = req.get("newPassword");

    User user = userRepo.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    // check old password
    
    if (!encoder.matches(oldPassword, user.getPassword())) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Old password incorrect");
    }


    user.setPassword(encoder.encode(newPassword));

    userRepo.save(user);

    return Map.of("message", "Password updated successfully");
}


}
