package com.example.backendagile.dto;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public class ReponseEvaluationDTO {
    private Long idEvaluation;
    private String idEtudiant;
    private String commentaire;
    private String nomEtudiant;
    private String prenomEtudiant;
    private Long noEnseignant;
    private String nomEnseignant;
    private String prenomEnseignant;
    private String codeFormation;
    private String anneeUniversitaire;
    private String codeUE;
    private String designationUE;
    private String nomFormation;
    @Min(value = 1, message = "Le numéro d'évaluation doit être supérieur à 0")
    @Max(value = 99, message = "Le nombre maximum d'étudiants doit être inférieur à 99")
    private Short noEvaluation;
    @Size(max = 16, message = "La désignation ne doit pas dépasser 16 caractères")
    private String designation;
    private String etat;
    private String periode;
    private LocalDate debutReponse;
    private LocalDate finReponse;
    private List<RubriqueReponseDTO> rubriques;


    public Long getIdEvaluation() {
        return idEvaluation;
    }

    public void setIdEvaluation(Long idEvaluation) {
        this.idEvaluation = idEvaluation;
    }

    public String getIdEtudiant() {
        return idEtudiant;
    }

    public void setIdEtudiant(String idEtudiant) {
        this.idEtudiant = idEtudiant;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }

    public String getNom() {
        return nomEtudiant;
    }

    public void setNom(String nom) {
        this.nomEtudiant = nom;
    }

    public String getPrenom() {
        return prenomEtudiant;
    }

    public void setPrenom(String prenom) {
        this.prenomEtudiant = prenom;
    }
}
