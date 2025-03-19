package com.example.backendagile.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

@Data
public class EtudiantDTO {
    @NotBlank
    private String noEtudiant;
    @NotBlank
    private String nom;
    @NotBlank
    private String prenom;
    @NotBlank
    private String sexe;
    @NotNull
    private LocalDate dateNaissance;
    @NotBlank
    private String lieuNaissance;
    @NotBlank
    private String nationalite;
    private String telephone;
    private String mobile;
    @NotBlank
    private String email;
    @NotBlank
    private String emailUbo;
    @NotBlank
    private String adresse;
    private String codePostal;
    @NotBlank
    private String ville;
    @NotBlank
    private String paysOrigine;
    @NotBlank
    private String universiteOrigine;
    private Long groupeTp;
    private Long groupeAnglais;
    @NotBlank
    private String motPasse;
    @NotBlank
    private String anneeUniversitaire;
    @NotBlank
    private String codeFormation;
}