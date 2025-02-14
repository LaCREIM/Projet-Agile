package com.example.backendagile.controllers;

import com.example.backendagile.dto.RubriqueQuestionStdDTO;
import com.example.backendagile.services.RubriqueQuestionStdService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Collections;

@RestController
@RequestMapping("/api/rubrique-questions/standard")
@CrossOrigin(origins = "*")
public class RubriqueQuestionStdController {

    private final RubriqueQuestionStdService rubriqueQuestionStdService;

    public RubriqueQuestionStdController(RubriqueQuestionStdService rubriqueQuestionStdService) {
        this.rubriqueQuestionStdService = rubriqueQuestionStdService;
    }
    
    @GetMapping("/{idRubrique}")
    public ResponseEntity<?> getQuestionsByRubrique(@PathVariable Long idRubrique) {
        try {
            List<RubriqueQuestionStdDTO> questions = rubriqueQuestionStdService.getQuestionsByRubrique(idRubrique);
            if (questions.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Collections.singletonMap("message", "Aucune question standard trouvée pour cette rubrique."));
            }
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Une erreur est survenue."));
        }
    }
    
    
    @GetMapping
    public ResponseEntity<List<RubriqueQuestionStdDTO>> getAllRubriquesQuestionStd() {
        List<RubriqueQuestionStdDTO> rubriqueQuestions = rubriqueQuestionStdService.getAllRubriquesQuestionStd();
        return ResponseEntity.ok(rubriqueQuestions);
    }

    @PostMapping("/save-update")
    public ResponseEntity<Void> saveOrUpdateRubriqueQuestions(@RequestBody List<RubriqueQuestionStdDTO> rubriqueQuestionDtos) {
        rubriqueQuestionStdService.saveOrUpdateRubriqueQuestions(rubriqueQuestionDtos);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();  
    }
    @DeleteMapping("/{idRubrique}/{idQuestion}")
public ResponseEntity<String> deleteRubriqueQuestion(
        @PathVariable Long idRubrique,
        @PathVariable Long idQuestion) {
    try {
        rubriqueQuestionStdService.deleteRubriqueQuestion(idRubrique, idQuestion);
        return ResponseEntity.ok("Rubrique Question Standard supprimée avec succès.");
    } catch (IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Une erreur inattendue est survenue lors de la suppression.");
    }
}

}
