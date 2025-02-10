package com.example.backendagile.dto;

public class QuestionPrsDTO {
    String intitule;
    Long idQuestion;
    Long idQualificatif;


    public QuestionPrsDTO() {
    }

    public QuestionPrsDTO(String intitule, Long idQuestion, Long idQualificatif) {
        this.intitule = intitule;
        this.idQuestion = idQuestion;
        this.idQualificatif = idQualificatif;
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
