package com.example.backendagile.mapper;

import com.example.backendagile.dto.*;
import com.example.backendagile.entities.*;
import com.example.backendagile.repositories.UniteEnseignementRepository;

import java.util.stream.Collectors;

public class EvaluationMapper {

  
    public static EvaluationDTO toDTO(Evaluation evaluation,UniteEnseignementRepository uniteEnseignementRepository) {
//        System.out.println("Evaluation dans toDTO : "+evaluation);
        EvaluationDTO dto = new EvaluationDTO();
        dto.setIdEvaluation(evaluation.getId());
        dto.setCodeFormation(evaluation.getCodeFormation());
        dto.setCodeUE(evaluation.getCodeUE());
        if(evaluation.getUniteEnseignement()!=null){
            dto.setDesignationUE(evaluation.getUniteEnseignement().getDesignation());
        }
        else{
            UniteEnseignement ue = uniteEnseignementRepository.findById(evaluation.getCodeFormation(), evaluation.getCodeUE());
            dto.setDesignationUE(ue.getDesignation());

        }

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
                rubriqueDTO.setOrdre(rubrique.getOrdre());

            
                if (rubrique.getQuestions() != null) {
                    rubriqueDTO.setQuestions(rubrique.getQuestions().stream().map(question -> {
                        QuestionEvaluationDTO questionDTO = new QuestionEvaluationDTO();
                        questionDTO.setIdQuestionEvaluation(question.getId());
                        questionDTO.setIntitule(question.getIdQuestion().getIntitule());
                        questionDTO.setOrdre(question.getOrdre());

                      
                        if (question.getIdQualificatif() != null) {
                            QualificatifDTO qualificatifDTO = new QualificatifDTO();
                            qualificatifDTO.setMinimal(question.getIdQualificatif().getMinimal());
                            qualificatifDTO.setMaximal(question.getIdQualificatif().getMaximal());
                            questionDTO.setQualificatif(qualificatifDTO);
                        } 
                        return questionDTO;
                    }).collect(Collectors.toList()));
                }

                return rubriqueDTO;
            }).collect(Collectors.toList()));
        }

        return dto;
    }

    public static Evaluation toEntity(EvaluationDTO dto, UniteEnseignementRepository uniteEnseignementRepository) {
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
        
        UniteEnseignement uniteEnseignement = uniteEnseignementRepository.findById(dto.getCodeFormation(), dto.getCodeUE());
        evaluation.setUniteEnseignement(uniteEnseignement);
        Enseignant enseignant = new Enseignant();
        enseignant.setId(dto.getNoEnseignant());
        evaluation.setEnseignant(enseignant);

        return evaluation;
    }
}
