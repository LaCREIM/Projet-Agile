package com.example.backendagile.controllers;
import org.springframework.http.ResponseEntity;
import com.example.backendagile.dto.EvaluationDTO;
import com.example.backendagile.dto.EvaluationPartagerDTO;
import com.example.backendagile.services.EvaluationService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
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
    public ResponseEntity<?> createEvaluation(@RequestBody EvaluationDTO dto) {
        try {
            EvaluationDTO savedDto = evaluationService.createEvaluation(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedDto);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Une erreur s'est produite lors de la création de l'évaluation : ");
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
    public ResponseEntity<String> deleteEvaluation(@PathVariable Long id) {
        try {
            evaluationService.deleteEvaluation(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Évaluation supprimée avec succès.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("L'évaluation ne peut pas être supprimée car elle est déjà remplie.");
        }
    }

    @GetMapping("/enseignants/{idEnseignant}/{idEvaluation}")
    public ResponseEntity<EvaluationDTO> getEvaluation(
            @PathVariable Long idEnseignant,
            @PathVariable Long idEvaluation) {
        EvaluationDTO evaluation = evaluationService.getEvaluationByEnseignantAndId(idEnseignant, idEvaluation);
        return ResponseEntity.ok(evaluation);
    }

    @GetMapping("/evaluations-partage/{noEnseignant}")
    public ResponseEntity<List<EvaluationPartagerDTO>> getEvaluationsPartagees(@PathVariable Long noEnseignant) {

        return ResponseEntity.ok(evaluationService.getEvaluationsPartagees(noEnseignant));

    }

    @PostMapping("/dupliquer/{idEvaluation}/{noEnseignant}")
    public ResponseEntity<String> dupliquerEvaluation(@PathVariable Long idEvaluation, @PathVariable Long noEnseignant) {
        try {
            EvaluationDTO evaluation = evaluationService.dupliquerEvaluation(idEvaluation, noEnseignant);
            return ResponseEntity.ok("L'évaluation a été dupliquée avec succès.");
//            return ResponseEntity.ok(evaluation);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("L'évaluation ne peut pas être dupliquée.");
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

    }
}
