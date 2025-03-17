package com.example.backendagile.mapper;

import com.example.backendagile.dto.EvaluationDTO;
import com.example.backendagile.dto.ReponseEvaluationDTO;
import com.example.backendagile.dto.RubriqueReponseDTO;
import com.example.backendagile.entities.ReponseEvaluation;
import com.example.backendagile.entities.Etudiant;
import com.example.backendagile.entities.Evaluation;
import java.util.List;
import org.springframework.stereotype.Service;
@Service
public class ReponseEvaluationMapper {
   
    public ReponseEvaluationDTO toDTO(EvaluationDTO evaluationDTO, List<RubriqueReponseDTO> rubriqueReponseDTOs,String idEtudiant,String commentaire) {
        ReponseEvaluationDTO reponseEvaluationDTO = new ReponseEvaluationDTO();
        reponseEvaluationDTO.setIdEvaluation(evaluationDTO.getIdEvaluation());
        reponseEvaluationDTO.setIdEtudiant(idEtudiant);
        reponseEvaluationDTO.setCommentaire(commentaire);
        reponseEvaluationDTO.setNoEnseignant(evaluationDTO.getNoEnseignant());
        reponseEvaluationDTO.setNomEnseignant(evaluationDTO.getNomEnseignant());
        reponseEvaluationDTO.setPrenomEnseignant(evaluationDTO.getPrenomEnseignant());
        reponseEvaluationDTO.setCodeFormation(evaluationDTO.getCodeFormation());
        reponseEvaluationDTO.setAnneeUniversitaire(evaluationDTO.getAnneeUniversitaire());
        reponseEvaluationDTO.setCodeUE(evaluationDTO.getCodeUE());
        reponseEvaluationDTO.setDesignationUE(evaluationDTO.getDesignationUE());
        reponseEvaluationDTO.setNomFormation(evaluationDTO.getNomFormation());
        reponseEvaluationDTO.setNoEvaluation(evaluationDTO.getNoEvaluation());
        reponseEvaluationDTO.setDesignation(evaluationDTO.getDesignation());
        reponseEvaluationDTO.setEtat(evaluationDTO.getEtat());
        reponseEvaluationDTO.setPeriode(evaluationDTO.getPeriode());
        reponseEvaluationDTO.setDebutReponse(evaluationDTO.getDebutReponse());
        reponseEvaluationDTO.setFinReponse(evaluationDTO.getFinReponse());
        reponseEvaluationDTO.setRubriques(rubriqueReponseDTOs);


        return reponseEvaluationDTO;
    }
}
