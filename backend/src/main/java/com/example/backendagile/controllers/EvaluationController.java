package com.example.backendagile.controllers;

import org.springframework.http.ResponseEntity;
import com.example.backendagile.dto.EvaluationDTO;
import com.example.backendagile.dto.EvaluationPartagerDTO;
import com.example.backendagile.services.EvaluationService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.transaction.Transactional;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    public ResponseEntity<?> createEvaluation(@RequestBody EvaluationDTO dto) {
        try {
            EvaluationDTO savedDto = evaluationService.createEvaluation(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedDto);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("L'evaluation existe déjà.");
        }
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
    public ResponseEntity<Map<String,String>> deleteEvaluation(@PathVariable Long id) {
        Map<String,String> response = new HashMap<>();
        try {
            response.put("message", "L'évaluation a été supprimée avec succès.");
            evaluationService.deleteEvaluation(id);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            response.put("message", "L'évaluation ne peut pas être supprimée car elle est déjà remplie.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/{idEvaluation}")
    public ResponseEntity<EvaluationDTO> getEvaluation(
            @PathVariable Long idEvaluation) {
        EvaluationDTO evaluation = evaluationService.getEvaluationByEnseignantAndId(idEvaluation);
        return ResponseEntity.ok(evaluation);
    }

    @GetMapping("/evaluations-partage/{noEnseignant}")
    public ResponseEntity<List<EvaluationPartagerDTO>> getEvaluationsPartagees(@PathVariable Long noEnseignant) {
        return ResponseEntity.ok(evaluationService.getEvaluationsPartagees(noEnseignant));

    }
    @Transactional
    @PostMapping("/dupliquer/{idEvaluation}/{noEnseignant}")
    public ResponseEntity<Map<String, Object>> dupliquerEvaluation(@PathVariable Long idEvaluation, @PathVariable Long noEnseignant) {
        Map<String, Object> response = new HashMap<>();
        try {
            evaluationService.dupliquerEvaluation(idEvaluation, noEnseignant);
            response.put("message", "La duplication de l'évaluation a été effectuée avec succès.");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            response.put("message", "Evaluation déja dupliquée");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

    }
  /*   @GetMapping("/etudiant/{idEtudiant}")
    public ResponseEntity<Map<String, Object>> getEvaluationsByEtudiant(@PathVariable String idEtudiant) {
        Map<String, Object> response = evaluationService.getEvaluationsByEtudiant(idEtudiant);
        return ResponseEntity.ok(response);
    }*/

    @GetMapping("/etudiant/{idEtudiant}")
    public ResponseEntity<Map<String, Object>> getEvaluationsByEtudiant(@PathVariable String idEtudiant) {
        try {
            Map<String, Object> response = evaluationService.getEvaluationsByEtudiant(idEtudiant);
            return ResponseEntity.ok(response);
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode())
                    .body(Collections.singletonMap("message", ex.getReason()));
        }
    }
}
