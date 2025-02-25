package com.example.backendagile.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginRequestDTO {
    // Getters and Setters
    @NotBlank
    private String username;
    @NotBlank
    private String password;

}