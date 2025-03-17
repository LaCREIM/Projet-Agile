package com.example.backendagile.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
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

}
