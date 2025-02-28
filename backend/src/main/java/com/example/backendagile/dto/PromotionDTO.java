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
    private Short nbMaxEtudiant;

    @FutureOrPresent(message = "La date de réponse LP doit être dans le futur ou le présent")
    private LocalDate dateReponseLp;

    @FutureOrPresent(message = "La date de réponse LALP doit être dans le futur ou le présent")
    private LocalDate dateReponseLalp;

    @FutureOrPresent(message = "La date de rentrée doit être dans le futur ou le présent")
    private LocalDate dateRentree;

    @Size(max = 12, message = "Le lieu de rentrée ne doit pas dépasser 12 caractères")
    private String lieuRentree;

    @NotBlank(message = "Le processus de stage est obligatoire")
    @Size(max = 5, message = "Le processus de stage ne doit pas dépasser 5 caractères")
    private String processusStage;

    @Size(max = 255, message = "Le commentaire ne doit pas dépasser 255 caractères")
    private String commentaire;

    @NotBlank(message = "Le code de formation est obligatoire")
    private String codeFormation;

    @NotBlank(message = "Le nom de la formation est obligatoire")
    private String nomFormation;

    @Email(message = "L'email de l'enseignant doit être valide")
    private String emailEnseignant;

    @NotBlank(message = "Le diplôme est obligatoire")
    private String diplome;

    @NotNull(message = "Le numéro de l'enseignant est obligatoire")
    private Long noEnseignant;

    @NotBlank(message = "Le type est obligatoire")
    private String type;

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;
}