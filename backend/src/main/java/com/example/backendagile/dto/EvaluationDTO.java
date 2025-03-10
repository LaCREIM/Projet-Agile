package com.example.backendagile.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import java.util.List;
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
    @Max(value = 99,message = "Le nombre maximum d'étudiants doit être inférieur à 99")
    private Short noEvaluation;
    @Size(max = 16, message = "La désignation ne doit pas dépasser 16 caractères")
    private String designation;
    private String etat;
    private String periode;
    private LocalDate debutReponse;
    private LocalDate finReponse;    
    private List<RubriqueEvaluationDTO> rubriques;
    
 public List<RubriqueEvaluationDTO> getRubriques() {
        return rubriques;
    }
    public void setRubriques(List<RubriqueEvaluationDTO> rubriques) {
        this.rubriques = rubriques;
    }

    public Long getNoEnseignant() {
        return noEnseignant;
    }

    public String getNomFormation() {
        return nomFormation;
    }
    public void setNomFormation(String nomFormation) {
        this.nomFormation = nomFormation;
    }
    public void setNoEnseignant(Long noEnseignant) {
        this.noEnseignant = noEnseignant;
    }

    public String getCodeFormation() {
        return codeFormation;
    }

    public Long getIdEvaluation() {
        return idEvaluation;
    }
    public void setIdEvaluation(Long id) {
        this.idEvaluation = id;
    }
    public void setCodeFormation(String codeFormation) {
        this.codeFormation = codeFormation;
    }

    public String getNomEnseignant() {
        return nomEnseignant;
    }
    public void setNomEnseignant(String nomEnseignant) {
        this.nomEnseignant = nomEnseignant;
    }

    public String getPrenomEnseignant() {
        return prenomEnseignant;
    }
    public void setPrenomEnseignant(String prenomEnseignant) {
        this.prenomEnseignant = prenomEnseignant;
    }

    public String getAnneeUniversitaire() {
        return anneeUniversitaire;
    }

    public void setAnneeUniversitaire(String anneeUniversitaire) {
        this.anneeUniversitaire = anneeUniversitaire;
    }
    public String getCodeUE() {
        return codeUE;
    }

    public void setCodeUE(String codeUE) {
        this.codeUE = codeUE;
    }

    public String getDesignationUE() {
        return designationUE;
    }

    public void setDesignationUE(String designationUE) {
        this.designationUE = designationUE;
    }

    public String getCodeEC() {
        return codeEC;
    }
    public void setCodeEC(String codeEC) {
        this.codeEC = codeEC;
    }

    public String getDesignationEC() {
        return designationEC;
    }

    public void setDesignationEC(String designationEC) {
        this.designationEC = designationEC;
    }

    public Short getNoEvaluation() {
        return noEvaluation;
    }

    public void setNoEvaluation(Short noEvaluation) {
        this.noEvaluation = noEvaluation;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getEtat() {
        return etat;
    }

    public void setEtat(String etat) {
        this.etat = etat;
    }

    public String getPeriode() {
        return periode;
    }

    public void setPeriode(String periode) {
        this.periode = periode;
    }

    public LocalDate getDebutReponse() {
        return debutReponse;
    }

    public void setDebutReponse(LocalDate debutReponse) {
        this.debutReponse = debutReponse;
    }

    public LocalDate getFinReponse() {
        return finReponse;
    }

    public void setFinReponse(LocalDate finReponse) {
        this.finReponse = finReponse;
    }


}

