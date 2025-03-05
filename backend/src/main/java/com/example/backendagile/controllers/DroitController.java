package com.example.backendagile.controllers;


import com.example.backendagile.dto.DroitDTO;
import com.example.backendagile.entities.Droit;
import com.example.backendagile.services.DroitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/droits")
public class DroitController {

    private final DroitService droitService;

    public DroitController(DroitService droitService) {
        this.droitService = droitService;
    }

    // 🔍 Récupérer les droits par évaluation
    @GetMapping("/evaluation/{idEvaluation}")
    public ResponseEntity<List<DroitDTO>> getDroitsByEvaluation(@PathVariable Long idEvaluation) {
        return ResponseEntity.ok(droitService.getDroitsByEvaluation(idEvaluation));
    }

    // ➕ Créer un droit
    @PostMapping
    public ResponseEntity<Droit> createDroit(@RequestBody DroitDTO droitDTO) {
        Droit createdDroit = droitService.createDroit(droitDTO);
        return ResponseEntity.ok(createdDroit);
    }

    // ✏️ Mettre à jour un droit
    @PutMapping("/{idEvaluation}/{idEnseignant}")
    public ResponseEntity<Droit> updateDroit(
            @PathVariable Long idEvaluation,
            @PathVariable Long idEnseignant,
            @RequestBody DroitDTO droitDTO) {
        Droit updatedDroit = droitService.updateDroit(idEvaluation, idEnseignant, droitDTO);
        return ResponseEntity.ok(updatedDroit);
    }

    // 🗑️ Supprimer un droit
    @DeleteMapping("/{idEvaluation}/{idEnseignant}")
    public ResponseEntity<Void> deleteDroit(@PathVariable Long idEvaluation, @PathVariable Long idEnseignant) {
        droitService.deleteDroit(idEvaluation, idEnseignant);
        return ResponseEntity.noContent().build();
    }
}
