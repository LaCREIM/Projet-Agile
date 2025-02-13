package com.example.backendagile.dto;

public class RubriqueQuestionStdDTO {
    private Long idRubrique;
    private String designationRubrique;
    private Long idQuestion; 
    private QuestionStdDTO questionStdDTO;
    private Long ordre;

    public RubriqueQuestionStdDTO(Long idRubrique, String designationRubrique, Long idQuestion, QuestionStdDTO questionStdDTO, Long ordre) {
        this.idRubrique = idRubrique;
        this.designationRubrique = designationRubrique;
        this.idQuestion = idQuestion;
        this.questionStdDTO = questionStdDTO;
        this.ordre = ordre;
    }

    public Long getIdQuestion() {
        return idQuestion;
    }

    public void setIdQuestion(Long idQuestion) {
        this.idQuestion = idQuestion;
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

    public QuestionStdDTO getQuestionStdDTO() {
        return questionStdDTO;
    }

    public void setQuestionStdDTO(QuestionStdDTO questionStdDTO) {
        this.questionStdDTO = questionStdDTO;
    }

    public Long getOrdre() {
        return ordre;
    }

    public void setOrdre(Long ordre) {
        this.ordre = ordre;
    }
}
