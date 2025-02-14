package com.example.backendagile.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class PromotionDTO {

    @NotBlank
    private String anneeUniversitaire;

    @NotBlank
    @Size(max = 16)
    private String siglePromotion;

    @NotNull
    @Min(1)
    private Short nbMaxEtudiant;

    @PastOrPresent
    private LocalDate dateReponseLp;

    @PastOrPresent
    private LocalDate dateReponseLalp;

    @Future
    private LocalDate dateRentree;

    @NotBlank
    @Size(max = 12)
    private String lieuRentree;

    @NotBlank
    @Size(max = 5)
    private String processusStage;

    @Size(max = 255)
    private String commentaire;

    @NotBlank
    private String codeFormation;

    @NotBlank
    private String nomFormation;

    @Email
    private String emailEnseignant;

    @NotBlank
    private String diplome;

    @NotNull
    private Long noEnseignant;

    @NotBlank
    private String type;

    @NotBlank
    private String nom;

    @NotBlank
    private String prenom;
}