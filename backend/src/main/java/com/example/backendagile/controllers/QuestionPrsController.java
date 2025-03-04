package com.example.backendagile.controllers;

import com.example.backendagile.dto.QuestionPrsDTO;
import com.example.backendagile.entities.Question;
import com.example.backendagile.services.QuestionPrsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
@RestController
@RequestMapping("/api/questionsPrs")
public class QuestionPrsController {

    private final QuestionPrsService questionPrsService;

    public QuestionPrsController(QuestionPrsService questionPrsService) {
        this.questionPrsService = questionPrsService;
    }


       /**
     * Récupérer toutes les questions standards PAGINÉES et ordonnées alphabétiquement
     */
    @GetMapping("/paged")
    public ResponseEntity<Map<String, Object>> getAllQuestionsPaged(
            @RequestParam Long noEnseignant,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
    
        List<Question> questions = questionPrsService.getQuestionsPaged(noEnseignant, page, size);
        int totalPages = questionPrsService.getTotalPages(noEnseignant, size); 
    
        Map<String, Object> response = new HashMap<>();
        response.put("questions", questions);
        response.put("currentPage", page);
        response.put("size", size);
        response.put("totalPages", totalPages);
    
        return ResponseEntity.ok(response);
    }
    


    /**
     * Permet de faire une recherche dont les résultats sont PAGINÉES et ordonnés par intitulé alphabetiquement
     */
    @GetMapping("/search-paged")
    public ResponseEntity<Map<String, Object>> searchQuestionsPaged(
             @RequestParam Long noEnseignant,
             @RequestParam String keyword,
             @RequestParam(defaultValue = "1") int page,
             @RequestParam(defaultValue = "10") int size) {

        List<Question> questions = questionPrsService.searchPersonalQuestionsPaged(noEnseignant, keyword, page, size);
        int totalPages = questionPrsService.getSearchTotalPages(noEnseignant, keyword, size);
    
        Map<String, Object> response = new HashMap<>();
        response.put("questions", questions);
        response.put("currentPage", page);
        response.put("size", size);
        response.put("totalPages", totalPages);
    
        return ResponseEntity.ok(response);
    }
    

    @GetMapping
    public ResponseEntity<List<QuestionPrsDTO>> getAllQuestions() {
        List<QuestionPrsDTO> questions = questionPrsService.getAllQuestions();
        return ResponseEntity.ok(questions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionPrsDTO> getQuestionById(@PathVariable Long id) {
        Optional<QuestionPrsDTO> question = questionPrsService.getQuestionById(id);
        return question.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<QuestionPrsDTO> createQuestion(@RequestBody QuestionPrsDTO questionPrsDTO) {
        QuestionPrsDTO createdQuestion = questionPrsService.saveQuestion(questionPrsDTO);
        return ResponseEntity.ok(createdQuestion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestionPrsDTO> updateQuestion(@PathVariable Long id, @RequestBody QuestionPrsDTO questionPrsDTO) {
        QuestionPrsDTO updatedQuestion = questionPrsService.updateQuestion(id, questionPrsDTO);
        return ResponseEntity.ok(updatedQuestion);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionPrsService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/enseignant/{noEnseignant}")
    public List<QuestionPrsDTO> getQuestionsByEnseignant(@PathVariable Long noEnseignant) {
        return questionPrsService.getQuestionsByEnseignant(noEnseignant);
    }
}
