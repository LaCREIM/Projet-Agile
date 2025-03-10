package com.example.backendagile.mapper;

import com.example.backendagile.dto.*;
import com.example.backendagile.entities.*;

import java.util.stream.Collectors;

public class EvaluationMapper {

    public static EvaluationDTO toDTO(Evaluation evaluation) {
        EvaluationDTO dto = new EvaluationDTO();
        dto.setIdEvaluation(evaluation.getId());
        dto.setCodeFormation(evaluation.getCodeFormation());
        dto.setCodeUE(evaluation.getCodeUE());
        dto.setDesignationUE(evaluation.getUniteEnseignement().getDesignation());
        dto.setCodeEC(evaluation.getCodeEC());
        dto.setAnneeUniversitaire(evaluation.getAnneeUniversitaire());
        dto.setNoEvaluation(evaluation.getNoEvaluation());
        dto.setDesignation(evaluation.getDesignation());
        dto.setEtat(evaluation.getEtat());
        dto.setPeriode(evaluation.getPeriode());
        dto.setDebutReponse(evaluation.getDebutReponse());
        dto.setFinReponse(evaluation.getFinReponse());

        if (evaluation.getEnseignant() != null) {
            dto.setNoEnseignant(evaluation.getEnseignant().getId());
            dto.setNomEnseignant(evaluation.getEnseignant().getNom());
            dto.setPrenomEnseignant(evaluation.getEnseignant().getPrenom());
        }

        if (evaluation.getRubriqueEvaluations() != null) {
            dto.setRubriques(evaluation.getRubriqueEvaluations().stream().map(rubrique -> {
                RubriqueEvaluationDTO rubriqueDTO = new RubriqueEvaluationDTO();
                rubriqueDTO.setIdRubriqueEvaluation(rubrique.getId());
                rubriqueDTO.setDesignation(rubrique.getIdRubrique().getDesignation());
                //rubriqueDTO.setDesignation(rubrique.getDesignation());
                rubriqueDTO.setOrdre(rubrique.getOrdre());

            
                if (rubrique.getQuestions() != null) {
                    rubriqueDTO.setQuestions(rubrique.getQuestions().stream().map(question -> {
                        QuestionEvaluationDTO questionDTO = new QuestionEvaluationDTO();
                        questionDTO.setIdQuestionEvaluation(question.getId());
                        questionDTO.setIntitule(question.getIdQuestion().getIntitule());
                        questionDTO.setOrdre(question.getOrdre());

                      
                        if (question.getIdQualificatif() != null) {
                            System.out.println("Qualificatif trouvé pour la question ID: " + question.getId());
                            System.out.println("Minimal : " + question.getIdQualificatif().getMinimal());
                            System.out.println("Maximal : " + question.getIdQualificatif().getMaximal());
                        
                            QualificatifDTO qualificatifDTO = new QualificatifDTO();
                            qualificatifDTO.setMinimal(question.getIdQualificatif().getMinimal());
                            qualificatifDTO.setMaximal(question.getIdQualificatif().getMaximal());
                            questionDTO.setQualificatif(qualificatifDTO);
                        } else {
                            System.out.println("❌ Aucun qualificatif trouvé pour la question ID: " + question.getId()+ question.getIdQualificatif());
                        }
                        
                        return questionDTO;
                    }).collect(Collectors.toList()));
                }

                return rubriqueDTO;
            }).collect(Collectors.toList()));
        }

        return dto;
    }

    public static Evaluation toEntity(EvaluationDTO dto) {
        Evaluation evaluation = new Evaluation();
        evaluation.setNoEvaluation(dto.getNoEvaluation());
        evaluation.setDesignation(dto.getDesignation());
        evaluation.setEtat(dto.getEtat());
        evaluation.setPeriode(dto.getPeriode());
        evaluation.setDebutReponse(dto.getDebutReponse());
        evaluation.setFinReponse(dto.getFinReponse());
        evaluation.setCodeUE(dto.getCodeUE());
        evaluation.setCodeEC(dto.getCodeEC());
        evaluation.setCodeFormation(dto.getCodeFormation());
        evaluation.setAnneeUniversitaire(dto.getAnneeUniversitaire());

        Enseignant enseignant = new Enseignant();
        enseignant.setId(dto.getNoEnseignant());
        evaluation.setEnseignant(enseignant);

        return evaluation;
    }
}
