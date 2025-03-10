package com.example.backendagile.controllers;

import com.example.backendagile.dto.LoginRequestDTO;
import com.example.backendagile.entities.Authentification;
import com.example.backendagile.services.AuthentificationService;
import com.example.backendagile.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

    private final AuthentificationService authentificationService;

    public LoginController(AuthentificationService authentificationService) {
        this.authentificationService = authentificationService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        Authentification auth = authentificationService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());

        if (auth != null) {
            // Generate a JWT token
            String token = JwtUtil.generateToken(loginRequest.getUsername());

            // Add the token to the response as an HTTP-only, secure cookie
            Cookie cookie = new Cookie("token", token);
            cookie.setHttpOnly(true);
            cookie.setSecure(true); // Use true in production
            cookie.setPath("/");
            cookie.setMaxAge(86400); // 1 day in seconds


            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("token", token);
            response.put("role", auth.getRole());
            if(auth.getNoEtudiant() != null) {
                response.put("id", String.valueOf(auth.getNoEtudiant().getNoEtudiant()));
            }
            else if(auth.getNoEnseignant() != null) {
                response.put("id", String.valueOf(auth.getNoEnseignant().getNoEnseignant()));
            }
            return ResponseEntity.ok()
                    .header("Set-Cookie", String.format("token=%s; HttpOnly; Secure; Path=/; Max-Age=%d", token, cookie.getMaxAge()))
                    .body(response);
        } else {
            return ResponseEntity.status(401).body(Map.of("message", "Les informations d'identification sont incorrectes"));
        }
    }
}