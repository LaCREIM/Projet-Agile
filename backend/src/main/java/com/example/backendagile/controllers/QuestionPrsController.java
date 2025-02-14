package com.example.backendagile.controllers;

import com.example.backendagile.dto.QuestionPrsDTO;
import com.example.backendagile.services.QuestionPrsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/questionsPrs")
public class QuestionPrsController {

    private final QuestionPrsService questionPrsService;

    public QuestionPrsController(QuestionPrsService questionPrsService) {
        this.questionPrsService = questionPrsService;
    }


    @GetMapping("/paged")
    public ResponseEntity<List<QuestionPrsDTO>> getAllQuestions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<QuestionPrsDTO> questions = questionPrsService.getAllQuestionsPaged(page, size);
        return ResponseEntity.ok(questions);
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
