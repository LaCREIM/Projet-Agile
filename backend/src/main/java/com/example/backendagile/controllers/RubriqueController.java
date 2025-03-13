package com.example.backendagile.controllers;

import com.example.backendagile.dto.QuestionPrsDTO;
import com.example.backendagile.dto.RubriqueDTO;
import com.example.backendagile.entities.Rubrique;
import com.example.backendagile.services.QuestionPrsService;
import com.example.backendagile.services.RubriqueService;
import org.springframework.beans.factory.annotation.Autowired;
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


    /*
     *  @GetMapping("/std-prs/{noEnseignant}")
    public List<RubriqueDTO> getRubriquesStdAndPerso(@PathVariable Long noEnseignant) {
        return rubriqueService.getRubriqueStdAndPerso(noEnseignant);
      }
      */
    @PostMapping
    public ResponseEntity<RubriqueDTO> createRubrique(@RequestBody RubriqueDTO dto) {
        RubriqueDTO createdRubrique = rubriqueService.createRubrique(dto);
        return ResponseEntity.ok(createdRubrique);
    }
}
