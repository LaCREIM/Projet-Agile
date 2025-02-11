package com.example.backendagile.controllers;

import com.example.backendagile.dto.LoginRequestDTO;
import com.example.backendagile.services.AuthentificationService;
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
    public ResponseEntity<String> login(@RequestBody LoginRequestDTO loginRequest) {
        boolean isAuthenticated = authentificationService.authenticate(loginRequest.getUsername(), loginRequest.getMotPasse());

        if (isAuthenticated) {
            // return jwk
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
}