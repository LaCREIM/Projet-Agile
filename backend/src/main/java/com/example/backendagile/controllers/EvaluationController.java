package com.example.backendagile.controllers;

import com.example.backendagile.dto.EvaluationDTO;
import com.example.backendagile.services.EvaluationService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evaluations")
@CrossOrigin(origins = "*")
public class EvaluationController {

    private final EvaluationService evaluationService;

    public EvaluationController(EvaluationService evaluationService) {
        this.evaluationService = evaluationService;
    }

    @GetMapping("/enseignant/{id}")
    public ResponseEntity<List<EvaluationDTO>> getEvaluationsByEnseignant(@PathVariable Long id) {
        return ResponseEntity.ok(evaluationService.getEvaluationsByEnseignant(id));
    }


    @PostMapping
    public ResponseEntity<EvaluationDTO> createEvaluation(@RequestBody EvaluationDTO dto) {
        EvaluationDTO created = evaluationService.createEvaluation(dto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EvaluationDTO> updateEvaluation(
            @PathVariable Long id,
            @RequestBody EvaluationDTO dto) {
        return evaluationService.updateEvaluation(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

   @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEvaluation(@PathVariable Long id) {
        try {
            evaluationService.deleteEvaluation(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Évaluation supprimée avec succès.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("L'évaluation ne peut pas être supprimée car elle est déjà remplie.");        }
    }

    @GetMapping("/enseignants/{idEnseignant}/{idEvaluation}")
public ResponseEntity<EvaluationDTO> getEvaluation(
        @PathVariable Long idEnseignant,
        @PathVariable Long idEvaluation) {
    EvaluationDTO evaluation = evaluationService.getEvaluationByEnseignantAndId(idEnseignant, idEvaluation);
    return ResponseEntity.ok(evaluation);
}

}
