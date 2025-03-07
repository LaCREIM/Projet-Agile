package com.example.backendagile.dto;

public class RubriquePrsDTO {
    private Long idRubriquePrs;
    private String designation;
    private Long ordre;
    private Long noEnseignant;

    public RubriquePrsDTO(Long idRubriquePrs, String designation, Long ordre, Long noEnseignant) {
        this.idRubriquePrs = idRubriquePrs;
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
        return idRubriquePrs;
    }

    public void setIdRubriquePrs(Long idRubriquePrs) {
        this.idRubriquePrs = idRubriquePrs;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }
}
