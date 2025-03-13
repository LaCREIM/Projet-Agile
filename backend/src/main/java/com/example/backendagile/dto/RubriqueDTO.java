package com.example.backendagile.dto;

public class RubriqueDTO {
    private Long id;
    private String designation;
    private Long ordre;
    private Long noEnseignant;
    private String type;

    public RubriqueDTO() {
    }

    public RubriqueDTO(Long id, String designation, Long ordre, Long noEnseignant, String type) {
        this.id = id;
        this.designation = designation;
        this.ordre = ordre;
        this.noEnseignant = noEnseignant;
        this.type = type;
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public Long getOrdre() {
        return ordre;
    }

    public void setOrdre(Long ordre) {
        this.ordre = ordre;
    }

    public Long getNoEnseignant() {
        return noEnseignant;
    }

    public void setNoEnseignant(Long noEnseignant) {
        this.noEnseignant = noEnseignant;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
