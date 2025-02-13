package com.example.backendagile.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Email;

@Data
public class EnseignantDTO {
    @NotBlank
    private String nom;

    @NotBlank
    private String prenom;

    @NotBlank
    private String adresse;

    @NotBlank
    private String sexe;

    @NotBlank
    private String ville;

    @NotBlank
    private String pays;

    @NotBlank
    private String mobile;

    @NotBlank
    private String telephone;

    @NotBlank
    private String codePostal;

    @NotBlank
    private String type;

    @NotBlank
    @Email
    private String emailUbo;

    @NotBlank
    @Email
    private String emailPerso;

    @NotBlank
    private String motPasse;
}