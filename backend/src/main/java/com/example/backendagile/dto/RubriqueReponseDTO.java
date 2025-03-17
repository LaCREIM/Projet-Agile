package com.example.backendagile.dto;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class RubriqueReponseDTO {
    private Long idRubriqueEvaluation;
    private Long idRubrique;
    private String designation;
    private List <QuestionReponseDTO> questions;
}
