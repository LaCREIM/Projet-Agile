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
     * 🔹 Récupérer toutes les évaluations
     */
    @GetMapping
    public ResponseEntity<List<Evaluation>> getAllEvaluations() {
        List<Evaluation> evaluations = evaluationService.getAllEvaluations();
        return ResponseEntity.ok(evaluations);
    }

    /**
     * 🔹 Récupérer une évaluation par ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getEvaluationById(@PathVariable Long id) {
        Evaluation evaluation = evaluationService.getEvaluationById(id).orElse(null);
    
        if (evaluation == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("message", "Évaluation non trouvée avec l'ID : " + id));
        }
    
        return ResponseEntity.ok(evaluation);
    }
    
    
    

    /**
     * 🔹 Créer une nouvelle évaluation
     */
    @PostMapping
    public ResponseEntity<?> createEvaluation(@RequestBody Evaluation evaluation) {
        try {
            Evaluation newEvaluation = evaluationService.createEvaluation(evaluation);
            return ResponseEntity.status(HttpStatus.CREATED).body(newEvaluation);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erreur lors de la création de l'évaluation.");
        }
    }

    /**
     * 🔹 Mettre à jour une évaluation existante
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvaluation(@PathVariable Long id, @RequestBody Evaluation evaluationDetails) {
        try {
            Evaluation updatedEvaluation = evaluationService.updateEvaluation(id, evaluationDetails);
            return ResponseEntity.ok(updatedEvaluation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erreur lors de la mise à jour de l'évaluation.");
        }
    }

    /**
     * 🔹 Supprimer une évaluation par ID
     */
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
    }
}
