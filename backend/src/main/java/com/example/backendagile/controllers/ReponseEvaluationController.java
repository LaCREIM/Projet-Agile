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

    @PostMapping
    public ResponseEntity<ReponseEvaluationDTO> addReponse(@RequestBody ReponseEvaluationDTO dto) {
        ReponseEvaluationDTO response = reponseEvaluationService.addReponse(dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{idEvaluation}")
    public ResponseEntity<List<ReponseEvaluationDTO>> getReponsesByEvaluation(@PathVariable Long idEvaluation) {
        List<ReponseEvaluationDTO> reponses = reponseEvaluationService.getReponsesByEvaluation(idEvaluation);
        return ResponseEntity.ok(reponses);
    }
}
