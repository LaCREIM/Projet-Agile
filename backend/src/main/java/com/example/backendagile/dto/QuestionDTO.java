package com.example.backendagile.dto;

import lombok.Data;

@Data
public class QuestionDTO {
    Long noEnseignant;
    String intitule;
    Long idQuestion;
    Long idQualificatif;
    String maxQualificatif;
    String minQualificatif;
    String type;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public QuestionDTO(Long noEnseignant, String intitule, Long idQuestion, Long idQualificatif, String maxQualificatif, String minQualificatif, String type) {
        this.type = type;
        this.noEnseignant = noEnseignant;
        this.intitule = intitule;
        this.idQuestion = idQuestion;
        this.idQualificatif = idQualificatif;
        this.maxQualificatif = maxQualificatif;
        this.minQualificatif = minQualificatif;
    }

    public Long getNoEnseignant() {
        return noEnseignant;
    }

    public void setNoEnseignant(Long noEnseignant) {
        this.noEnseignant = noEnseignant;
    }

    public String getIntitule() {
        return intitule;
    }

    public void setIntitule(String intitule) {
        this.intitule = intitule;
    }

    public Long getIdQuestion() {
        return idQuestion;
    }

    public void setIdQuestion(Long idQuestion) {
        this.idQuestion = idQuestion;
    }

    public Long getIdQualificatif() {
        return idQualificatif;
    }

    public void setIdQualificatif(Long idQualificatif) {
        this.idQualificatif = idQualificatif;
    }

    public String getMaxQualificatif() {
        return maxQualificatif;
    }

    public void setMaxQualificatif(String maxQualificatif) {
        this.maxQualificatif = maxQualificatif;
    }

    public String getMinQualificatif() {
        return minQualificatif;
    }

    public void setMinQualificatif(String minQualificatif) {
        this.minQualificatif = minQualificatif;
    }



}
