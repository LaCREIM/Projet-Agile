package com.example.backendagile.dto;

import java.time.LocalDate;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Setter
@Getter
public class EvaluationDTO {
    private Long idEvaluation;
    private Long noEnseignant;
    private String nomEnseignant;
    private String prenomEnseignant;
    private String codeFormation;
    private String anneeUniversitaire;
    private String codeUE;
    private String designationUE;
    private String nomFormation;
    private String codeEC;
    private String designationEC;
    @Min(value = 1, message = "Le numéro d'évaluation doit être supérieur à 0")
    @Max(value = 99, message = "Le nombre maximum d'étudiants doit être inférieur à 99")
    private Short noEvaluation;
    @Size(max = 16, message = "La désignation ne doit pas dépasser 16 caractères")
    private String designation;
    private String etat;
    private String periode;
    private LocalDate debutReponse;
    private LocalDate finReponse;
    private List<RubriqueEvaluationDTO> rubriques;


}

