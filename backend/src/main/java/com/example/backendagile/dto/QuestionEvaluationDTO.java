package com.example.backendagile.dto;

public class QuestionEvaluationDTO {
    
        private Long idQuestionEvaluation;
        private String intitule;
        private Short ordre;
        private QualificatifDTO qualificatif;
    
    
        public QualificatifDTO getQualificatif() {
            return qualificatif;
        }
        public void setQualificatif(QualificatifDTO qualificatif) {
            this.qualificatif = qualificatif;
        }

    public Long getIdQuestionEvaluation() {
        return idQuestionEvaluation;
    }

    public void setIdQuestionEvaluation(Long idQuestionEvaluation) {
        this.idQuestionEvaluation = idQuestionEvaluation;
    }
    public String getIntitule() {
        return intitule;
    }
    public void setIntitule(String intitule) {
        this.intitule = intitule;
    }
    public Short getOrdre() {
        return ordre;
    }
    public void setOrdre(Short ordre) {
        this.ordre = ordre;
    }
}
