package com.example.backendagile.dto;

import jakarta.validation.constraints.NotBlank;

public class DroitDTO {

    @NotBlank(message = "L'id evaluation est obligatoire")
    private Long idEvaluation;
    @NotBlank(message = "L'id Enseignant est obligatoire")
    private Long idEnseignant;
    private String nom;
    private String prenom;
    @NotBlank(message = "La consultation est obligatoire")
    private char consultation;
    @NotBlank(message = "La duplication est obligatoire")
    private char duplication;

    public DroitDTO(Long idEvaluation, Long idEnseignant, String nom, String prenom, char consultation, char duplication) {
        this.idEvaluation = idEvaluation;
        this.idEnseignant = idEnseignant;
        this.nom = nom;
        this.prenom = prenom;
        this.consultation = consultation;
        this.duplication = duplication;
    }

    public DroitDTO() {
    }

    public Long getIdEvaluation() {
        return idEvaluation;
    }

    public void setIdEvaluation(Long idEvaluation) {
        this.idEvaluation = idEvaluation;
    }

    public Long getIdEnseignant() {
        return idEnseignant;
    }

    public void setIdEnseignant(Long idEnseignant) {
        this.idEnseignant = idEnseignant;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public char getConsultation() {
        return consultation;
    }

    public void setConsultation(char consultation) {
        this.consultation = consultation;
    }

    public char getDuplication() {
        return duplication;
    }

    public void setDuplication(char duplication) {
        this.duplication = duplication;
    }
}

