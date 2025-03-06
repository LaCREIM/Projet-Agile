
package com.example.backendagile.mapper;

import com.example.backendagile.dto.EvaluationDTO;
import com.example.backendagile.entities.Evaluation;
import com.example.backendagile.entities.Enseignant;
import com.example.backendagile.entities.Promotion;
import com.example.backendagile.entities.PromotionId;

public class EvaluationMapper {

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

    Promotion promotion = new Promotion();
    PromotionId promoId = new PromotionId();
    promoId.setCodeFormation(dto.getCodeFormation());
    promoId.setAnneeUniversitaire(dto.getAnneeUniversitaire());
    promotion.setId(promoId);   
    evaluation.setPromotion(promotion);

    Enseignant enseignant = new Enseignant();
    enseignant.setId(dto.getNoEnseignant());
    evaluation.setEnseignant(enseignant);

    return evaluation;
}


    public static EvaluationDTO toDTO(Evaluation evaluation) {
        EvaluationDTO dto = new EvaluationDTO();
        dto.setIdEvaluation(evaluation.getId()); 
        dto.setCodeFormation(evaluation.getCodeFormation());
        dto.setAnneeUniversitaire(evaluation.getAnneeUniversitaire());
        dto.setCodeUE(evaluation.getCodeUE());
        dto.setCodeEC(evaluation.getCodeEC());
        dto.setNoEvaluation(evaluation.getNoEvaluation());
        dto.setDesignation(evaluation.getDesignation());
        dto.setEtat(evaluation.getEtat());
        dto.setPeriode(evaluation.getPeriode());
        dto.setDebutReponse(evaluation.getDebutReponse());
        dto.setFinReponse(evaluation.getFinReponse());

        if (evaluation.getEnseignant() != null) {
            dto.setNoEnseignant(evaluation.getEnseignant().getNoEnseignant());
        }
        if (evaluation.getUniteEnseignement() != null) {
            dto.setDesignationUE(evaluation.getUniteEnseignement().getDesignation());
        }

        return dto;
    }
}
