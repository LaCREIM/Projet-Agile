package com.example.backendagile.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class QuestionStatistiqueDTO {
    private Long idQuestion;
    private Double moyennePositionnement;
    private Double medianPositionnement;
    private String maximal;
    private String minimal;
    private Long nbReponses;
    private String intitule;
    private String designation;
    private long[] totalPositionnements;
}