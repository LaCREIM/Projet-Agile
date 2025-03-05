package com.example.backendagile.dto;

import com.example.backendagile.repositories.QuestionRepository;

public class QuestionPrsDTO {
    Long noEnseignant;
    String intitule;
    Long idQuestion;
    Long idQualificatif;
    String maxQualificatif;
    String minQualificatif;

    public QuestionPrsDTO() {
    }

    public QuestionPrsDTO(String intitule, Long idQuestion, Long idQualificatif) {
        this.intitule = intitule;
        this.idQuestion = idQuestion;
        this.idQualificatif = idQualificatif;
    }

    public Long getNoEnseignant() {
        return noEnseignant;
    }

    public void setNoEnseignant(Long noEnseignant) {
        this.noEnseignant = noEnseignant;
    }

    public String getMinQualificatif() {
        return minQualificatif;
    }

    public void setMinQualificatif(String minQualificatif) {
        this.minQualificatif = minQualificatif;
    }

    public String getMaxQualificatif() {
        return maxQualificatif;
    }

    public void setMaxQualificatif(String naxQualificatif) {
        this.maxQualificatif = naxQualificatif;
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
}
