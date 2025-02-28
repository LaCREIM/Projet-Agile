package com.example.backendagile.controllers;

import com.example.backendagile.dto.QuestionStdDTO;
import com.example.backendagile.entities.Question;
import com.example.backendagile.services.QuestionStdService;
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
    private QuestionStdService questionStdService;

    @GetMapping("/paged")
    public ResponseEntity<List<Question>> getStandardQuestionsPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<Question> questions = questionStdService.getStandardQuestionsPaged(page, size);
        return ResponseEntity.ok(questions);
    }
    /**
     * Récupérer toutes les questions standards (renvoie les entités)
     */
    @GetMapping
    public ResponseEntity<List<Question>> getStandardQuestions() {
        return ResponseEntity.ok(questionStdService.getStandardQuestions());
    }

    /**
     * Récupérer une question standard par ID (renvoie l'entité)
     */
    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable Long id) {
        Optional<Question> question = questionStdService.findById(id);
        return question.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Créer une question standard (utilise DTO)
     */
    @PostMapping
    public ResponseEntity<String> createStandardQuestion(@RequestBody QuestionStdDTO questionStdDTO) {
        try {
            Optional<Question> existingQuestion = questionStdService.findByIntitule(questionStdDTO.getIntitule().trim());
            if(existingQuestion!=null){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La question existe déjà.");
            }


            QuestionStdDTO createdQuestion = questionStdService.createStandardQuestion(questionStdDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body("La question a été créée avec succès.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * Mettre à jour une question standard existante (utilise DTO)
     */
    @PutMapping("/{id}")
    public ResponseEntity<QuestionStdDTO> updateStandardQuestion(@PathVariable Long id, @RequestBody QuestionStdDTO questionDto) {
        try {
            Question updatedQuestion = questionStdService.updateStandardQuestion(id, questionDto);
    
            // Créer un DTO uniquement avec les champs souhaités
            QuestionStdDTO responseDto = new QuestionStdDTO();
            responseDto.setIdQualificatif(updatedQuestion.getIdQualificatif().getId());
            responseDto.setIntitule(updatedQuestion.getIntitule());
    
            return ResponseEntity.ok(responseDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    

    /**
     * Supprimer une question standard par ID (utilise l'entité directement)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteQuestion(@PathVariable Long id) {
        if (!questionStdService.findById(id).isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucune question trouvée avec cet ID.");
        }
        try {
            questionStdService.deleteById(id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La question est déjà utilisée.");
        }
        return ResponseEntity.ok("La question a été supprimée avec succès.");
    }
}
