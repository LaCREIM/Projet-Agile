package com.example.backendagile.controllers;

import com.example.backendagile.dto.PromotionDTO;
import com.example.backendagile.entities.Promotion;
import com.example.backendagile.services.FormationService;
import com.example.backendagile.services.PromotionService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;


/**
 * REST controller for managing promotions and related operations.
 */
@Slf4j
@RestController
@RequestMapping("/api/promotions")
public class PromotionController {


    private final PromotionService promotionService;

    /**
     * Constructor to initialize services for promotions and formations.
     *
     * @param promotionService the service for managing promotions
     * @param formationService the service for managing formations
     */
    public PromotionController(PromotionService promotionService, FormationService formationService) {
        this.promotionService = promotionService;
    }

    /**
     * Retrieves all promotions.
     *
     * @return a list of all {@link PromotionDTO} objects
     */
    @GetMapping
    public List<PromotionDTO> getAllPromotions() {
        return promotionService.getAllPromotions();
    }

//    @GetMapping("/search")
//    public List<PromotionDTO> getPromotionsByName(@RequestParam String name) {
//        return promotionService.getPromotionsByName(name);
//    }

    /**
     * Retrieves a promotion by its ID.
     *
     * @param anneeUniversitaire the ID of the promotion to retrieve
     * @return a {@link ResponseEntity} containing the promotion, or a 404 status if not found
     */
    @GetMapping("/{anneeUniversitaire}/{codeFormation}")
    public PromotionDTO getPromotionById(@PathVariable String anneeUniversitaire, @PathVariable String codeFormation) {
        return promotionService.getPromotionById(anneeUniversitaire, codeFormation);
    }

    /**
     * Creates a new promotion.
     *
     * @param promotion the {@link PromotionDTO} containing the details of the new promotion
     * @return a {@link ResponseEntity} containing the created {@link Promotion}
     */
    @PostMapping
    public ResponseEntity<Map<String, String>> createPromotion(@Valid @RequestBody PromotionDTO promotion) {
        if (promotion.getCodeFormation() == null || promotion.getCodeFormation().isEmpty()) {
            throw new IllegalArgumentException("Code Formation cannot be null or empty");
        }
        try {
            PromotionDTO promotionDTO = promotionService.getPromotionById(promotion.getAnneeUniversitaire(), promotion.getCodeFormation());
            if (promotionDTO != null) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "La promotion existe déjà");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }
            promotionService.createPromotion(promotion);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Promotion créée avec succès");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }


    @PutMapping("/{anneeUniversitaire}/{codeFormation}")
    public ResponseEntity<Map<String, String>> updatePromotion(@PathVariable String anneeUniversitaire, @PathVariable String codeFormation, @RequestBody PromotionDTO promotion) {
        try {
            promotionService.updatePromotion(anneeUniversitaire, codeFormation, promotion);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Promotion mise à jour avec succès");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Erreur lors de la mise à jour de la promotion");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Deletes a promotion by its ID.
     *
     * @param anneeUniversitaire the ID of the promotion to delete
     * @return a {@link ResponseEntity} with a 204 status upon successful deletion
     */
    @DeleteMapping("/{anneeUniversitaire}/{codeFormation}")
    public ResponseEntity<Map<String, String>> deletePromotion(@PathVariable String anneeUniversitaire, @PathVariable String codeFormation) {
        try {
            promotionService.deletePromotion(anneeUniversitaire, codeFormation);
            Map<String, String> response = new HashMap<>();
            response.put("message", "La promotion a été supprimée avec succès.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Cette promotion ne peut pas être supprimée car elle contient des étudiants.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
    }

    @GetMapping("/paged")
    public List<PromotionDTO> getAllPromotionPaged(@RequestParam int page, @RequestParam int size) {
        return promotionService.getPromotionPaged(page, size);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Promotion>> searchPromotions(@RequestParam String keyword) {
        List<Promotion> result = promotionService.searchPromotions(keyword);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/enseignant/{noEnseignant}")
    public ResponseEntity<List<PromotionDTO>> getPromotionsByEnseignantForEvaluation(@PathVariable Long noEnseignant) {
        List<PromotionDTO> promotions = promotionService.getPromotionsByEnseignantForEvaluation(noEnseignant);
        if(promotions == null || promotions.isEmpty() ){
            promotions = new ArrayList<>();
        }
        return ResponseEntity.ok(promotions);
    }
}