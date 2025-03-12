package com.example.backendagile.controllers;

import com.example.backendagile.entities.Rubrique;
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
    public ResponseEntity<List<Rubrique>> getRubriques() {
        return ResponseEntity.ok(rubriqueService.getRubriques());
    }


    /**
     * Récupérer toutes les rubriques avec pagination
     */
    @GetMapping("/paged/enseignants/{enseignantId}")
    public ResponseEntity<List<Rubrique>> getRubriques(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @PathVariable String enseignantId) {
        return ResponseEntity.ok(rubriqueService.getRubriquesPaged(enseignantId,page, size));
    }

}
