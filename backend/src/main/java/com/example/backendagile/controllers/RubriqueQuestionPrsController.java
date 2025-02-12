package com.example.backendagile.controllers;

import com.example.backendagile.dto.RubriqueQuestionPrsDTO;
import com.example.backendagile.services.RubriqueQuestionPrsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rubrique-questions/personnelle")
@CrossOrigin(origins = "*")
public class RubriqueQuestionPrsController {

    private final RubriqueQuestionPrsService rubriqueQuestionPrsService;

    public RubriqueQuestionPrsController(RubriqueQuestionPrsService rubriqueQuestionPrsService) {
        this.rubriqueQuestionPrsService = rubriqueQuestionPrsService;
    }

    @GetMapping("/enseignant/{noEnseignant}")
    public ResponseEntity<List<RubriqueQuestionPrsDTO>> getRubriquesByEnseignant(@PathVariable Long noEnseignant) {
        List<RubriqueQuestionPrsDTO> rubriqueQuestions = rubriqueQuestionPrsService.getRubriquesQuestionByEnseignant(noEnseignant);
        return ResponseEntity.ok(rubriqueQuestions);
    }

    // Nouvelle méthode pour sauvegarder ou mettre à jour une liste de RubriqueQuestionPrsDTO
    @PostMapping("/save-or-update")
    public ResponseEntity<Void> saveOrUpdateRubriqueQuestions(@RequestBody List<RubriqueQuestionPrsDTO> rubriqueQuestionDtos) {
        rubriqueQuestionPrsService.saveOrUpdateRubriqueQuestions(rubriqueQuestionDtos);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); // Réponse 204 No Content
    }
}
