package com.example.backendagile.services;

import com.example.backendagile.entities.Evaluation;
import com.example.backendagile.repositories.EvaluationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
//import java.util.Optional;

@Service
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;

    public EvaluationService(EvaluationRepository evaluationRepository) {
        this.evaluationRepository = evaluationRepository;
    }

    // 1. Récupérer les évaluations d'un enseignant donné
    public List<Evaluation> getEvaluationsByEnseignant(Long noEnseignant) {
        return evaluationRepository.findByNoEnseignant(noEnseignant);
    }

    // 2. Créer une nouvelle évaluation
    public Evaluation createEvaluation(Evaluation evaluation) {
        return evaluationRepository.save(evaluation);
    }

    // 3. Modifier une évaluation existante
    public Evaluation updateEvaluation(Long id, Evaluation newEvaluation) {
        Evaluation evaluation = evaluationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Évaluation non trouvée"));

        // Mise à jour des champs modifiables
        evaluation.setDesignation(newEvaluation.getDesignation());
        evaluation.setPeriode(newEvaluation.getPeriode());
        evaluation.setDebutReponse(newEvaluation.getDebutReponse());
        evaluation.setFinReponse(newEvaluation.getFinReponse());
        evaluation.setEtat(newEvaluation.getEtat());

        return evaluationRepository.save(evaluation);
    }

    /*public void deleteEvaluation(Long id) {
        if (!evaluationRepository.existsById(id)) {
            throw new IllegalArgumentException("Évaluation non trouvée avec l'ID : " + id);
        }
        evaluationRepository.deleteById(id);
    }*/
}
