package com.example.backendagile.services;

import com.example.backendagile.dto.EvaluationDTO;
import com.example.backendagile.entities.Evaluation;
import com.example.backendagile.mapper.EvaluationMapper;
import com.example.backendagile.repositories.EvaluationRepository;
import com.example.backendagile.repositories.FormationRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;

   private final FormationRepository formationRepository;  


    public EvaluationService(EvaluationRepository evaluationRepository, FormationRepository formationRepository) {
        this.evaluationRepository = evaluationRepository;
        this.formationRepository = formationRepository;
    }

    public List<EvaluationDTO> getEvaluationsByEnseignant(Long id) {
        List<Evaluation> evaluations = evaluationRepository.findByEnseignant_Id(id);
    
        return evaluations.stream().map(evaluation -> {
            EvaluationDTO dto = EvaluationMapper.toDTO(evaluation);
    
            formationRepository.findById(evaluation.getCodeFormation()).ifPresent(formation -> {
                dto.setNomFormation(formation.getNomFormation());
            });
            
            if (evaluation.getEnseignant() != null) {
                dto.setNomEnseignant(evaluation.getEnseignant().getNom());
                dto.setPrenomEnseignant(evaluation.getEnseignant().getPrenom());
            }
    
            return dto;
        }).collect(Collectors.toList());
    }
    

    public EvaluationDTO createEvaluation(EvaluationDTO dto) {
        Evaluation evaluation = EvaluationMapper.toEntity(dto);
        Evaluation saved = evaluationRepository.save(evaluation);
        return EvaluationMapper.toDTO(saved);
    }

    public EvaluationDTO getEvaluationByEnseignantAndId(Long idEnseignant, Long idEvaluation) {
        return evaluationRepository.findByEnseignant_IdAndId(idEnseignant, idEvaluation)
                .map(evaluation -> {
                    EvaluationDTO dto = EvaluationMapper.toDTO(evaluation);
    
                    formationRepository.findById(evaluation.getCodeFormation()).ifPresent(formation -> {
                        dto.setNomFormation(formation.getNomFormation());
                    });
    
                    if (evaluation.getEnseignant() != null) {
                        dto.setNomEnseignant(evaluation.getEnseignant().getNom());
                        dto.setPrenomEnseignant(evaluation.getEnseignant().getPrenom());
                    }
    
                    return dto;
                })
                .orElseThrow(() -> new RuntimeException("Évaluation non trouvée"));
    }
    
    
    

    public Optional<EvaluationDTO> updateEvaluation(Long id, EvaluationDTO dto) {
        return evaluationRepository.findById(id).map(existingEvaluation -> {
            existingEvaluation.setDesignation(dto.getDesignation());
            existingEvaluation.setCodeEC(dto.getCodeEC());
            existingEvaluation.setCodeUE(dto.getCodeUE());
            existingEvaluation.setCodeFormation(dto.getCodeFormation());
            existingEvaluation.setAnneeUniversitaire(dto.getAnneeUniversitaire());
            existingEvaluation.setNoEvaluation(dto.getNoEvaluation());
            existingEvaluation.setEtat(dto.getEtat());
            existingEvaluation.setPeriode(dto.getPeriode());
            existingEvaluation.setDebutReponse(dto.getDebutReponse());
            existingEvaluation.setFinReponse(dto.getFinReponse());
            Evaluation updated = evaluationRepository.save(existingEvaluation);
            return EvaluationMapper.toDTO(updated);
        });
    }

    public void deleteEvaluation(Long id) {
        evaluationRepository.deleteById(id);
    }

    public Evaluation getEvaluationByID(Long id){
        return evaluationRepository.findByIdEvaluation(id);
    }
}
