package com.example.backendagile.controllers;

import com.example.backendagile.dto.PromotionDTO;
import com.example.backendagile.entities.Promotion;
import com.example.backendagile.services.FormationService;
import com.example.backendagile.services.PromotionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


/**
 * REST controller for managing promotions and related operations.
 */
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

    @GetMapping("/search")
    public List<PromotionDTO> getPromotionsByName(@RequestParam String name) {
        return promotionService.getPromotionsByName(name);
    }

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
    public ResponseEntity<Promotion> createPromotion(@Valid @RequestBody PromotionDTO promotion) {
        if (promotion.getCodeFormation() == null || promotion.getCodeFormation().isEmpty()) {
            throw new IllegalArgumentException("Code Formation cannot be null or empty");
        }
        Promotion savedPromotion = promotionService.createPromotion(promotion);
        return ResponseEntity.ok(savedPromotion);
    }


    @PutMapping("/{anneeUniversitaire}/{codeFormation}")
    public ResponseEntity<String> updatePromotion(@PathVariable String anneeUniversitaire, @PathVariable String codeFormation, @RequestBody PromotionDTO promotion) {
        try {
            PromotionDTO updatedPromotion = promotionService.updatePromotion(anneeUniversitaire, codeFormation, promotion);
            return ResponseEntity.ok("Promotion mise à jour avec succès");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur lors de la mise à jour de la promotion");
        }
    }


    /**
     * Deletes a promotion by its ID.
     *
     * @param anneeUniversitaire the ID of the promotion to delete
     * @return a {@link ResponseEntity} with a 204 status upon successful deletion
     */
    @DeleteMapping("/{anneeUniversitaire}/{codeFormation}")
    public ResponseEntity<?> deletePromotion(@PathVariable String anneeUniversitaire, @PathVariable String codeFormation) {
        try {
            promotionService.deletePromotion(anneeUniversitaire, codeFormation);
            return new ResponseEntity<>("deleted", HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>("not deleted", HttpStatus.CONFLICT);
        }
    }

    @GetMapping("/paged")
    public List<PromotionDTO> getAllPromotionPaged(@RequestParam int page, @RequestParam int size) {
        return promotionService.getPromotionPaged(page, size);
    }


}