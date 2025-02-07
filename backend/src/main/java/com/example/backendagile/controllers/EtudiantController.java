package com.example.backendagile.controllers;

import com.example.backendagile.dto.EtudiantDTO;
import com.example.backendagile.services.EtudiantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/etudiants")
public class EtudiantController {

    @Autowired
    private EtudiantService etudiantService;

    /**
     * Récupérer une liste paginée d'étudiants
     */
    @GetMapping
    public ResponseEntity<List<EtudiantDTO>> getAllEtudiants(@RequestParam int page, @RequestParam int size) {
        List<EtudiantDTO> etudiants = etudiantService.getEtudiantsPaged(page, size);
        return ResponseEntity.ok(etudiants);
    }

    /**
     * Récupérer un étudiant par son ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<EtudiantDTO> getEtudiantById(@PathVariable String id) {
        return etudiantService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Créer un nouvel étudiant (avec sa promotion)
     */
    @PostMapping
    public ResponseEntity<EtudiantDTO> createEtudiant(@RequestBody EtudiantDTO etudiantDTO) {
        try {
            EtudiantDTO savedEtudiant = etudiantService.save(etudiantDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedEtudiant);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    /**
     * Mettre à jour un étudiant existant
     */
    @PutMapping("/{id}")
    public ResponseEntity<EtudiantDTO> updateEtudiant(@PathVariable String id, @RequestBody EtudiantDTO etudiantDTO) {
        try {
            EtudiantDTO updatedEtudiant = etudiantService.update(id, etudiantDTO);
            return ResponseEntity.ok(updatedEtudiant);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    /**
     * Récupérer les étudiants d'une promotion spécifique
     */
    @GetMapping("/promotion/{anneePro}/{codeFormation}")
    public ResponseEntity<List<EtudiantDTO>> getEtudiantsByPromotion(
            @PathVariable String anneePro,
            @PathVariable String codeFormation) {
        List<EtudiantDTO> etudiants = etudiantService.findEtudiantsByPromotion(anneePro, codeFormation);
        return ResponseEntity.ok(etudiants);
    }

    /**
     * Supprimer un étudiant par son ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEtudiant(@PathVariable String id) {
        if (etudiantService.findById(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucun étudiant trouvé avec cet ID.");
        }
        etudiantService.deleteById(id);
        return ResponseEntity.ok("Étudiant supprimé avec succès.");
    }
}
