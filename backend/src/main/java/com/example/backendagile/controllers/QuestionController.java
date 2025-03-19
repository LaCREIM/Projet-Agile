package com.example.backendagile.controllers;

import com.example.backendagile.dto.QuestionDTO;
import com.example.backendagile.entities.Question;
import com.example.backendagile.services.QuestionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping
    public ResponseEntity<List<QuestionDTO>> getAllQuestions() {
        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionDTO> getQuestionById(@PathVariable Long id) {
        return questionService.getQuestionById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Question Not Found"));
    }

    @PostMapping
    public ResponseEntity<QuestionDTO> createQuestion(@RequestBody QuestionDTO questionDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(questionService.saveQuestion(questionDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuestion(@PathVariable Long id, @RequestBody QuestionDTO questionDTO) {
        if (questionService.existsQuestionInEvaluation(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Impossible de modifier cette question car elle est utilisée dans une évaluation.");
        }

        try {
            QuestionDTO updatedQuestion = questionService.updateQuestion(id, questionDTO);
            return ResponseEntity.ok(updatedQuestion);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Aucune question trouvée avec cet ID.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Une erreur s'est produite lors de la mise à jour de la question.");
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/enseignant/{noEnseignant}")
    public ResponseEntity<List<QuestionDTO>> getQuestionsByEnseignant(@PathVariable Long noEnseignant) {
        return ResponseEntity.ok(questionService.getQuestionsByEnseignant(noEnseignant));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Question>> searchQuestionsPaged(
            @RequestParam Long noEnseignant,
            @RequestParam String keyword,
            @RequestParam int page,
            @RequestParam int size) {
        return ResponseEntity.ok(questionService.searchQuestionsPaged(noEnseignant, keyword, page, size));
    }

    @GetMapping("/search/total-pages")
    public ResponseEntity<Integer> getSearchTotalPages(
            @RequestParam Long noEnseignant,
            @RequestParam String keyword,
            @RequestParam int size) {
        return ResponseEntity.ok(questionService.getSearchTotalPages(noEnseignant, keyword, size));
    }

    @GetMapping("/paged")
    public ResponseEntity<List<Question>> getQuestionsPaged(
            @RequestParam Long noEnseignant,
            @RequestParam int page,
            @RequestParam int size) {
        return ResponseEntity.ok(questionService.getQuestionsPaged(noEnseignant, page, size));
    }

    @GetMapping("/total-pages")
    public ResponseEntity<Integer> getTotalPages(@RequestParam Long noEnseignant, @RequestParam int size) {
        return ResponseEntity.ok(questionService.getTotalPages(noEnseignant, size));
    }

    @GetMapping("/exists/{idQuestion}")
    public ResponseEntity<Boolean> existsQuestionInEvaluation(@PathVariable Long idQuestion) {
        return ResponseEntity.ok(questionService.existsQuestionInEvaluation(idQuestion));
    }

    @GetMapping("/std-prs/{noEnseignant}")
    public ResponseEntity<List<QuestionDTO>> getQuestionsStdAndPerso(@PathVariable Long noEnseignant) {
        return ResponseEntity.ok(questionService.getQuestionsStdAndPerso(noEnseignant));
    }
}

