package com.example.backendagile.controllers;

import com.example.backendagile.dto.ReponseEvaluationDTO;
import com.example.backendagile.dto.ReponseEvaluationPourEtudiantDTO;
import com.example.backendagile.services.ReponseEvaluationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reponse-evaluation-hashed")
public class ReponseEvaluationControllerHashed {

    private final ReponseEvaluationService reponseEvaluationService;

    public ReponseEvaluationControllerHashed(ReponseEvaluationService reponseEvaluationService) {
        this.reponseEvaluationService = reponseEvaluationService;
    }

    @GetMapping("/{idEvaluation}/{idEtudiantHashed}")
    public ResponseEntity<ReponseEvaluationDTO> getReponseEvaluationParEtudiantHash(@PathVariable Long idEvaluation, @PathVariable String idEtudiantHashed) {
        String idEtudiant = ReponseEvaluationPourEtudiantDTO.decryptIdEtudiant(idEtudiantHashed);
        return ResponseEntity.ok(reponseEvaluationService.getReponsesByEvaluationByEtudiant(idEvaluation, idEtudiant));
    }

}
