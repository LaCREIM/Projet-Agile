package com.example.backendagile.dto;

public class RubriquePrsDTO {
    private Long id;
    private String designation;
    private Long ordre;
    private Long noEnseignant;
    private String type;

    public RubriquePrsDTO(Long id, String designation, Long ordre, Long noEnseignant) {
        this.id = id;
        this.designation = designation;
        this.ordre = ordre;
        this.noEnseignant = (noEnseignant != null) ? noEnseignant : null;
    }



    public Long getNoEnseignant() {
        return noEnseignant;
    }

    public void setNoEnseignant(Long noEnseignant) {
        this.noEnseignant = noEnseignant;
    }

    public Long getOrdre() {
        return ordre;
    }

    public void setOrdre(Long ordre) {
        this.ordre = ordre;
    }

    public Long getIdRubriquePrs() {
        return id;
    }

    public void setIdRubriquePrs(Long idRubriquePrs) {
        this.id = idRubriquePrs;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }
}
