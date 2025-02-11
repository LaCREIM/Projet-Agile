package com.example.backendagile.controllers;

import com.example.backendagile.dto.LoginRequestDTO;
import com.example.backendagile.services.AuthentificationService;
import com.example.backendagile.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

    private final AuthentificationService authentificationService;

    public LoginController(AuthentificationService authentificationService) {
        this.authentificationService = authentificationService;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        boolean isAuthenticated = authentificationService.authenticate(loginRequest.getUsername(), loginRequest.getMotPasse());

        if (isAuthenticated) {
            // Generate a JWT token
            String token = JwtUtil.generateToken(loginRequest.getUsername());

            // Add the token to the response as an HTTP-only, secure cookie
            Cookie cookie = new Cookie("token", token);
            cookie.setHttpOnly(true);
            cookie.setSecure(true); // Use true in production
            cookie.setPath("/");
            cookie.setMaxAge(86400); // 1 day in seconds

            return ResponseEntity.ok()
                    .header("Set-Cookie", String.format("token=%s; HttpOnly; Secure; Path=/; Max-Age=%d", token, cookie.getMaxAge()))
                    .body("Login successful");
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
}