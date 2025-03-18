package com.example.backendagile.dto;

import jakarta.validation.constraints.NotNull;

public class DroitDTO {

    @NotNull(message = "L'id évaluation est obligatoire")
    private Long idEvaluation;

    @NotNull(message = "L'id Enseignant est obligatoire")
    private Long idEnseignant;

    private String nom;
    private String prenom;

    @NotNull(message = "La consultation est obligatoire")
    private Character consultation;

    @NotNull(message = "La duplication est obligatoire")
    private Character duplication;

    public DroitDTO(Long idEvaluation, Long idEnseignant, String nom, String prenom, Character consultation, Character duplication) {
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

    public Character getConsultation() {
        return consultation;
    }

    public void setConsultation(Character consultation) {
        this.consultation = consultation;
    }

    public Character getDuplication() {
        return duplication;
    }

    public void setDuplication(Character duplication) {
        this.duplication = duplication;
    }
}
