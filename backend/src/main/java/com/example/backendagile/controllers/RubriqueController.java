package com.example.backendagile.controllers;

import com.example.backendagile.dto.QuestionPrsDTO;
import com.example.backendagile.dto.RubriqueDTO;
import com.example.backendagile.entities.Rubrique;
import com.example.backendagile.services.QuestionPrsService;
import com.example.backendagile.services.RubriquePrsService;
import com.example.backendagile.services.RubriqueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rubriques")
public class RubriqueController {

    @Autowired
    private RubriqueService rubriqueService;


    /**
     * Récupérer toutes les rubriques standards
     */
    @GetMapping
    public ResponseEntity<List<RubriqueDTO>> getRubriques() {
        return ResponseEntity.ok(rubriqueService.getRubriques());
    }


    /**
     * Récupérer toutes les rubriques avec pagination
     */
    @GetMapping("/paged/enseignants/{enseignantId}")
    public ResponseEntity<List<RubriqueDTO>> getRubriques(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @PathVariable long enseignantId) {
        return ResponseEntity.ok(rubriqueService.getRubriquesPaged(enseignantId,page, size));
    }

    @GetMapping("/enseignants/{enseignantId}")
    public ResponseEntity<List<RubriqueDTO>> getRubriques2(
            @PathVariable long enseignantId) {
        return ResponseEntity.ok(rubriqueService.getRubriques(enseignantId));
    }


    /*
     *  @GetMapping("/std-prs/{noEnseignant}")
    public List<RubriqueDTO> getRubriquesStdAndPerso(@PathVariable Long noEnseignant) {
        return rubriqueService.getRubriqueStdAndPerso(noEnseignant);
      }
      */
    @PostMapping
    public ResponseEntity<Object> createRubrique(@RequestBody RubriqueDTO dto) {
        try {
            RubriqueDTO rubriqueDTO = rubriqueService.createRubrique(dto);
            return ResponseEntity.ok(rubriqueDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur lors de la création de la rubrique : " + e.getMessage());
        }
    }


}
