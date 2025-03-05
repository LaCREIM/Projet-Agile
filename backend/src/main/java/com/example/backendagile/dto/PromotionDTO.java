package com.example.backendagile.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class PromotionDTO {

    @NotBlank(message = "L'année universitaire est obligatoire")
    private String anneeUniversitaire;

    @NotBlank(message = "Le sigle de la promotion est obligatoire")
    @Size(max = 16, message = "Le sigle de la promotion ne doit pas dépasser 16 caractères")
    private String siglePromotion;

    @NotNull(message = "Le nombre maximum d'étudiants est obligatoire")
    @Min(value = 1, message = "Le nombre maximum d'étudiants doit être supérieur à 0")
    @Max(value = 1000,message = "Le nombre maximum d'étudiants doit être inférieur à 1000")
    private Short nbMaxEtudiant;

    @FutureOrPresent(message = "La date de réponse LP doit être dans le futur ou le présent")
    private LocalDate dateReponseLp;

    @FutureOrPresent(message = "La date de réponse LALP doit être dans le futur ou le présent")
    private LocalDate dateReponseLalp;

    @FutureOrPresent(message = "La date de rentrée doit être dans le futur ou le présent")
    private LocalDate dateRentree;

    @Size(max = 12, message = "Le lieu de rentrée ne doit pas dépasser 12 caractères")
    private String lieuRentree;

    @Size(max = 5, message = "Le processus de stage ne doit pas dépasser 5 caractères")
    private String processusStage;

    @Size(max = 255, message = "Le commentaire ne doit pas dépasser 255 caractères")
    private String commentaire;

    @NotBlank(message = "Le code de formation est obligatoire")
    private String codeFormation;

    private String nomFormation;

    @Email(message = "L'email de l'enseignant doit être valide")
    private String emailEnseignant;

    private String diplome;

    private Long noEnseignant;

    private String type;

    private String nom;

    private String prenom;
}