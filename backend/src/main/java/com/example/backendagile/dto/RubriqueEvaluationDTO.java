package com.example.backendagile.dto;

import java.util.List;

public class RubriqueEvaluationDTO {
    private Long idRubriqueEvaluation;
    private String designation;
    private Short ordre;
    private List<QuestionEvaluationDTO> questions;

    public Long getIdRubriqueEvaluation() {
        return idRubriqueEvaluation;
    }
    public void setIdRubriqueEvaluation(Long idRubriqueEvaluation) {
        this.idRubriqueEvaluation = idRubriqueEvaluation;
    }
    public String getDesignation() {
        return designation;
    }
    public void setDesignation(String designation) {
        this.designation = designation;
    }
    public Short getOrdre() {
        return ordre;
    }
    public void setOrdre(Short ordre) {
        this.ordre = ordre;
    }
    public List<QuestionEvaluationDTO> getQuestions() {
        return questions;
    }
    public void setQuestions(List<QuestionEvaluationDTO> questions) {
        this.questions = questions;
    }

}
