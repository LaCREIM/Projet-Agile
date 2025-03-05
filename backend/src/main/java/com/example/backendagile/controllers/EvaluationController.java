package com.example.backendagile.controllers;

import com.example.backendagile.entities.Evaluation;
import com.example.backendagile.services.EvaluationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Collections;

@RestController
@RequestMapping("/api/evaluations")
@CrossOrigin(origins = "*")
public class EvaluationController {

    private final EvaluationService evaluationService;

    public EvaluationController(EvaluationService evaluationService) {
        this.evaluationService = evaluationService;
    }
 /**
     * Récupérer toutes les évaluations d'un enseignant donné.
     */
    @GetMapping("/enseignant/{noEnseignant}")
    public ResponseEntity<List<Evaluation>> getEvaluationsByEnseignant(@PathVariable Long noEnseignant) {
        List<Evaluation> evaluations = evaluationService.getEvaluationsByEnseignant(noEnseignant);
        return ResponseEntity.ok(evaluations);
    }

    /**
     * Créer une nouvelle évaluation.
     */
    @PostMapping
    public ResponseEntity<Evaluation> createEvaluation(@RequestBody Evaluation evaluation) {
        Evaluation createdEvaluation = evaluationService.createEvaluation(evaluation);
        return ResponseEntity.ok(createdEvaluation);
    }

    /**
     * Modifier une évaluation existante.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Evaluation> updateEvaluation(
            @PathVariable Long id,
            @RequestBody Evaluation evaluation) {

        Evaluation updatedEvaluation = evaluationService.updateEvaluation(id, evaluation);
        return ResponseEntity.ok(updatedEvaluation);
    }
}

   

    /**
     * 🔹 Supprimer une évaluation par ID
     
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvaluation(@PathVariable Long id) {
        try {
            evaluationService.deleteEvaluation(id);
            return ResponseEntity.ok("Évaluation supprimée avec succès.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Une erreur inattendue est survenue lors de la suppression.");
        }
    }*/


