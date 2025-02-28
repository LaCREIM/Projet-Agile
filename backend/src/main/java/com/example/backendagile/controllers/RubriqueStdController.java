package com.example.backendagile.controllers;

import com.example.backendagile.dto.RubriqueStdDTO;
import com.example.backendagile.entities.Rubrique;
import com.example.backendagile.services.RubriqueStdService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rubriquesStd")
public class RubriqueStdController {

    @Autowired
    private RubriqueStdService rubriqueStdService;

    /**
     * Récupérer toutes les rubriques standards 
     */
    @GetMapping
    public ResponseEntity<List<Rubrique>> getStandardRubriques() {
        return ResponseEntity.ok(rubriqueStdService.getStandardRubriques());
    }

    /**
     * Récupérer une rubrique standard par ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Rubrique> getRubriqueById(@PathVariable Long id) {
        Optional<Rubrique> rubrique = rubriqueStdService.findById(id);
        return rubrique.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Créer une rubrique standard
     */
    @PostMapping
    public ResponseEntity<String> createStandardRubrique(@RequestBody RubriqueStdDTO rubriqueStdDTO) {
        try {
            Optional<Rubrique> existingRubrique = rubriqueStdService.findByDesignation(rubriqueStdDTO.getDesignation().trim());
            if(existingRubrique.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("La rubrique existe déjà.");
            }
            RubriqueStdDTO createdRubrique = rubriqueStdService.createStandardRubrique(rubriqueStdDTO);
            return ResponseEntity.status(201).body("La rubrique a été créée avec succès.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Mettre à jour une rubrique standard 
     */
    @PutMapping("/{id}")
    public ResponseEntity<RubriqueStdDTO> updateStandardRubrique(@PathVariable Long id, @RequestBody RubriqueStdDTO rubriqueDto) {
        Optional<Rubrique> existingRubrique = rubriqueStdService.findById(id);
    
        if (existingRubrique.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
    
        // Mise à jour de la désignation
        Rubrique updatedRubrique = rubriqueStdService.updateStandardRubrique(id, rubriqueDto.getDesignation());
    
        // Conversion de l'entité mise à jour en DTO
        RubriqueStdDTO responseDto = new RubriqueStdDTO();
        responseDto.setDesignation(updatedRubrique.getDesignation());
    
        return ResponseEntity.ok(responseDto);
    }
    

    /**
     * Supprimer une rubrique standard
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRubrique(@PathVariable Long id) {
        if (!rubriqueStdService.findById(id).isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucune rubrique trouvée avec cet ID.");
        }
        try {
            rubriqueStdService.deleteById(id);
            return ResponseEntity.ok("La rubrique a été supprimée avec succès.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Il faut vider la rubrique de ses questions avant de la supprimer.");
        }
    }
}
