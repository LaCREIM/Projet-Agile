package com.example.backendagile.dto;

public class RubriqueQuestionPrsDTO {
    private Long idRubrique;
    private String designationRubrique;
    private QuestionPrsDTO questionPrsDTO;
    private Long ordre;

    public RubriqueQuestionPrsDTO(Long idRubrique, String designationRubrique, QuestionPrsDTO question, Long ordre) {
        this.idRubrique = idRubrique;
        this.designationRubrique = designationRubrique;
        this.questionPrsDTO = question;
        this.ordre = ordre;
    }

    public QuestionPrsDTO getQuestionPrsDTO() {
        return questionPrsDTO;
    }

    public void setQuestionPrsDTO(QuestionPrsDTO questionPrsDTO) {
        this.questionPrsDTO = questionPrsDTO;
    }

    public Long getIdRubrique() {
        return idRubrique;
    }

    public void setIdRubrique(Long idRubrique) {
        this.idRubrique = idRubrique;
    }

    public String getDesignationRubrique() {
        return designationRubrique;
    }

    public void setDesignationRubrique(String designationRubrique) {
        this.designationRubrique = designationRubrique;
    }

    public Long getOrdre() {
        return ordre;
    }

    public void setOrdre(Long ordre) {
        this.ordre = ordre;
    }
}
