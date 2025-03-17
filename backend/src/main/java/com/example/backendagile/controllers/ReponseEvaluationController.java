package com.example.backendagile.controllers;

import com.example.backendagile.dto.QuestionStatistiqueDTO;
import com.example.backendagile.dto.ReponseEvaluationDTO;
import com.example.backendagile.dto.ReponseEvaluationPourEtudiantDTO;
import com.example.backendagile.services.ReponseEvaluationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reponse-evaluation")
public class ReponseEvaluationController {

    private final ReponseEvaluationService reponseEvaluationService;

    public ReponseEvaluationController(ReponseEvaluationService reponseEvaluationService) {
        this.reponseEvaluationService = reponseEvaluationService;
    }

    @GetMapping("/{idEvaluation}/{idEtudiant}")
    public ResponseEntity<ReponseEvaluationDTO> getReponseEvaluationParEtudiant(@PathVariable Long idEvaluation, @PathVariable String idEtudiant) {
        return ResponseEntity.ok(reponseEvaluationService.getReponsesByEvaluationByEtudiant(idEvaluation, idEtudiant));
    }

    @GetMapping("/{idEvaluation}")
    public ResponseEntity<List<ReponseEvaluationPourEtudiantDTO>> getReponseEvaluation(@PathVariable Long idEvaluation) {
        try {
            List<ReponseEvaluationPourEtudiantDTO> reponses = reponseEvaluationService.getReponsesByEvaluation(idEvaluation);
            return ResponseEntity.ok(reponses);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/statistiques/{idEvaluation}")
    public ResponseEntity<List<QuestionStatistiqueDTO>> getStatistiquesByEvaluation(@PathVariable Long idEvaluation) {
        List<QuestionStatistiqueDTO> statistiques = reponseEvaluationService.getStatistiquesByEvaluation(idEvaluation);
        return ResponseEntity.ok(statistiques);
    }


}
