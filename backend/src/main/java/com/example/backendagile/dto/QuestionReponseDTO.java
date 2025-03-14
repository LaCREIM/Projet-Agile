package com.example.backendagile.dto;

import org.hibernate.annotations.SecondaryRow;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuestionReponseDTO {
    
    private Long idQuestion;
    private Long positionnement;
    private String intitule;
    private QualificatifDTO qualificatif;
}
