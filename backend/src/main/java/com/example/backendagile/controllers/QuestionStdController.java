package com.example.backendagile.controllers;

import com.example.backendagile.dto.QuestionStdDTO;
import com.example.backendagile.entities.Question;
import com.example.backendagile.services.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/questionsStd")
public class QuestionStdController {

    @Autowired
    private QuestionService questionService;

    /**
     * Récupérer toutes les questions standards (renvoie les entités)
     */
    @GetMapping
    public ResponseEntity<List<Question>> getStandardQuestions() {
        return ResponseEntity.ok(questionService.getStandardQuestions());
    }

    /**
     * Récupérer une question standard par ID (renvoie l'entité)
     */
    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable Long id) {
        Optional<Question> question = questionService.findById(id);
        return question.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Créer une question standard (utilise DTO)
     */
    @PostMapping
    public ResponseEntity<QuestionStdDTO> createStandardQuestion(@RequestBody QuestionStdDTO questionStdDTO) {
        try {
            QuestionStdDTO createdQuestion = questionService.createStandardQuestion(questionStdDTO);
            return ResponseEntity.status(201).body(createdQuestion);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Mettre à jour une question standard existante (utilise DTO)
     */
    @PutMapping("/{id}")
    public ResponseEntity<QuestionStdDTO> updateStandardQuestion(@PathVariable Long id, @RequestBody QuestionStdDTO questionStdDTO) {
        try {
            QuestionStdDTO updatedQuestion = questionService.updateStandardQuestion(id, questionStdDTO);
            return ResponseEntity.ok(updatedQuestion);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Supprimer une question standard par ID (utilise l'entité directement)
     */
   @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteQuestion(@PathVariable Long id) {
        if (!questionService.findById(id).isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucune question trouvée avec cet ID.");
        }
        try {
            questionService.deleteById(id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La question est deja utilisée.");
        }
        return ResponseEntity.ok("La question a été supprimée avec succès.");
    }
}
