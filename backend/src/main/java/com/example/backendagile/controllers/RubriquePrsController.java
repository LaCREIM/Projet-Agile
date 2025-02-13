package com.example.backendagile.controllers;

import com.example.backendagile.dto.RubriquePrsDTO;
import com.example.backendagile.services.RubriquePrsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<RubriquePrsDTO> createRubrique(@RequestBody RubriquePrsDTO dto) {
        return ResponseEntity.ok(rubriqueService.createRubrique(dto));
    }

    // ✅ Mettre à jour une rubrique existante
    @PutMapping("/{id}")
    public ResponseEntity<RubriquePrsDTO> updateRubrique(@PathVariable Long id, @RequestBody RubriquePrsDTO dto) {
        return ResponseEntity.ok(rubriqueService.updateRubrique(id, dto));
    }

    // ✅ Supprimer une rubrique par ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRubrique(@PathVariable Long id) {
        rubriqueService.deleteRubrique(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/enseignant/{noEnseignant}")
    public ResponseEntity<List<RubriquePrsDTO>> getRubriquesByEnseignant(@PathVariable Long noEnseignant) {
        return ResponseEntity.ok(rubriqueService.getRubriquesByEnseignant(noEnseignant));
    }
}
