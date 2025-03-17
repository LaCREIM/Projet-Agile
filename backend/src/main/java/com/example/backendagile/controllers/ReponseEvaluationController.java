package com.example.backendagile.controllers;

import com.example.backendagile.dto.ReponseEvaluationDTO;
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
    public ResponseEntity<ReponseEvaluationDTO> getReponseEvaluation(@PathVariable Long idEvaluation, @PathVariable String idEtudiant) {
        return ResponseEntity.ok(reponseEvaluationService.getReponsesByEvaluation(idEvaluation, idEtudiant));
    }

    @PostMapping
    public ResponseEntity<String> createReponseEvaluation(@RequestBody ReponseEvaluationDTO reponseEvaluationDTO) {
        return ResponseEntity.ok(reponseEvaluationService.addReponseEvaluation(reponseEvaluationDTO));
    }

    @PutMapping("/reponse-evaluation")
    public ResponseEntity<String> updateReponseEvaluation(
            @RequestParam("idEvaluation") Long idEvaluation,
            @RequestParam("idEtudiant") String idEtudiant,
            @RequestBody ReponseEvaluationDTO reponseEvaluationDTO) {

        String result = reponseEvaluationService.updateReponseEvaluation(idEvaluation, idEtudiant, reponseEvaluationDTO);
        return ResponseEntity.ok(result);
    }




}
