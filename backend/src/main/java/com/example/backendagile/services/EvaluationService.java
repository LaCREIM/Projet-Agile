package com.example.backendagile.services;

import com.example.backendagile.entities.Evaluation;
import com.example.backendagile.repositories.EvaluationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;

    public EvaluationService(EvaluationRepository evaluationRepository) {
        this.evaluationRepository = evaluationRepository;
    }

    public List<Evaluation> getAllEvaluations() {
        return evaluationRepository.findAll();
    }

    public Optional<Evaluation> getEvaluationById(Long id) {
        return evaluationRepository.findById(id);
    }

    public Evaluation createEvaluation(Evaluation evaluation) {
        return evaluationRepository.save(evaluation);
    }

    public Evaluation updateEvaluation(Long id, Evaluation evaluationDetails) {
        return evaluationRepository.findById(id).map(evaluation -> {
            evaluation.setDesignation(evaluationDetails.getDesignation());
            evaluation.setEtat(evaluationDetails.getEtat());
            evaluation.setPeriode(evaluationDetails.getPeriode());
            evaluation.setDebutReponse(evaluationDetails.getDebutReponse());
            evaluation.setFinReponse(evaluationDetails.getFinReponse());
            return evaluationRepository.save(evaluation);
        }).orElseThrow(() -> new IllegalArgumentException("Évaluation non trouvée avec l'ID : " + id));
    }

    public void deleteEvaluation(Long id) {
        if (!evaluationRepository.existsById(id)) {
            throw new IllegalArgumentException("Évaluation non trouvée avec l'ID : " + id);
        }
        evaluationRepository.deleteById(id);
    }
}
