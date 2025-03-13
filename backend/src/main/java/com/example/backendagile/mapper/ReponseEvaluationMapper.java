package com.example.backendagile.mapper;

import com.example.backendagile.dto.ReponseEvaluationDTO;
import com.example.backendagile.entities.ReponseEvaluation;
import com.example.backendagile.entities.Etudiant;
import com.example.backendagile.entities.Evaluation;

public class ReponseEvaluationMapper {
    public static ReponseEvaluation toEntity(ReponseEvaluationDTO dto, Etudiant etudiant, Evaluation evaluation) {
        ReponseEvaluation reponse = new ReponseEvaluation();
        reponse.setIdEvaluation(evaluation);
        reponse.setNoEtudiant(etudiant);
        reponse.setCommentaire(dto.getCommentaire());
        reponse.setNom(dto.getNom());
        reponse.setPrenom(dto.getPrenom());
        return reponse;
    }

    public static ReponseEvaluationDTO toDTO(ReponseEvaluation reponse) {
        ReponseEvaluationDTO dto = new ReponseEvaluationDTO();
        dto.setIdEvaluation(reponse.getIdEvaluation().getId());
        dto.setIdEtudiant(reponse.getNoEtudiant().getNoEtudiant());
        dto.setCommentaire(reponse.getCommentaire());
        dto.setNom(reponse.getNom());
        dto.setPrenom(reponse.getPrenom());
        return dto;
    }
}
