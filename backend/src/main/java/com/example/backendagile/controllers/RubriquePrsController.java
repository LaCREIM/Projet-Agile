package com.example.backendagile.controllers;

import com.example.backendagile.dto.QuestionPrsDTO;
import com.example.backendagile.dto.RubriquePrsDTO;
import com.example.backendagile.dto.RubriqueStdDTO;
import com.example.backendagile.entities.Rubrique;
import com.example.backendagile.services.RubriquePrsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/rubriquesPrs")
public class RubriquePrsController {

    private final RubriquePrsService rubriqueService;

    public RubriquePrsController(RubriquePrsService rubriqueService) {
        this.rubriqueService = rubriqueService;
    }

    // ✅ Récupérer toutes les rubriques
    @GetMapping
    public ResponseEntity<List<RubriquePrsDTO>> getAllRubriques() {
        return ResponseEntity.ok(rubriqueService.getAllRubriques());
    }

    // ✅ Récupérer une rubrique par ID
    @GetMapping("/{id}")
    public ResponseEntity<RubriquePrsDTO> getRubriqueById(@PathVariable Long id) {
        return ResponseEntity.ok(rubriqueService.getRubriqueById(id));
    }

    // ✅ Ajouter une nouvelle rubrique
    @PostMapping
    public ResponseEntity<String> createRubrique(@RequestBody RubriquePrsDTO dto) {
        try {

            Optional<Rubrique> existingRubrique = rubriqueService.findByDesignation(dto.getDesignation().trim());
            if(existingRubrique.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("La rubrique existe déjà.");
            }
            rubriqueService.createRubrique(dto);
            return ResponseEntity.ok("La rubrique a été créée avec succès.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
        }

    // ✅ Mettre à jour une rubrique existante
    @PutMapping("/{id}")
    public ResponseEntity<String> updateRubrique(@PathVariable Long id, @RequestBody RubriquePrsDTO dto) {

        if(rubriqueService.existsRubriqueInEvaluation(id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("La rubrique est utilisée dans une évaluation Vous pouvez pas modifier la Designation.");
        }
        Optional<Rubrique> existingRubrique = rubriqueService.findById(id);

        if (existingRubrique.isEmpty()) {
            return ResponseEntity.badRequest().body("Aucune rubrique trouvée avec cet ID.");
        }

        try{
            Optional<Rubrique> existingRubriqueWithSameDesignation = rubriqueService.findByDesignationAndDiffrentID(id,dto.getDesignation().trim());
            if(existingRubriqueWithSameDesignation.isPresent()) {

                return ResponseEntity.status(HttpStatus.CONFLICT).body("La rubrique existe déjà.");
            }
            // Mise à jour de la désignation
            rubriqueService.updateRubrique(id, dto);

            return ResponseEntity.ok("La rubrique a été mise à jour avec succès.");

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }


    }

    // ✅ Supprimer une rubrique par ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRubrique(@PathVariable Long id) {
        if (!rubriqueService.findById(id).isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucune rubrique trouvée avec cet ID.");
        }
        try {
        rubriqueService.deleteRubrique(id);
            return ResponseEntity.ok("La rubrique a été supprimée avec succès.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Il faut vider la rubrique de ses questions avant de la supprimer.");
        }
    }

    @GetMapping("/enseignant/{noEnseignant}")
    public ResponseEntity<List<RubriquePrsDTO>> getRubriquesByEnseignant(@PathVariable Long noEnseignant) {
        return ResponseEntity.ok(rubriqueService.getRubriquesByEnseignant(noEnseignant));
    }
    @GetMapping("/search-paged")
    public ResponseEntity<Map<String, Object>> searchRubriquesPaged(
            @RequestParam String keyword,
            @RequestParam Long noEnseignant,
            @RequestParam int page,
            @RequestParam int size) {

        List<Rubrique> rubriques = rubriqueService.searchRubriquePaged(keyword, noEnseignant,page, size);
        int totalPages = rubriqueService.getTotalPagesForSearch(keyword, size);

        Map<String, Object> response = new HashMap<>();
        response.put("rubriques", rubriques);
        response.put("totalPages", totalPages);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/paged")
    public ResponseEntity<Map<String, Object>> getAllRubriquesPaged(@RequestParam() long noEnseignant,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {

        List<Rubrique> rubriques = rubriqueService.getAllRubriquesPaged(noEnseignant,page, size);

        Map<String, Object> response = new HashMap<>();
        response.put("rubriques", rubriques);
        response.put("currentPage", page);
        response.put("size", size);
        response.put("totalPages", rubriqueService.getTotalPages(size));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/std-prs/{noEnseignant}")
    public List<RubriquePrsDTO> getRubriquesStdAndPerso(@PathVariable Long noEnseignant) {
        return rubriqueService.getRubriqueStdAndPerso(noEnseignant);
    }
}
