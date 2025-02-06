package com.example.backendagile.controllers;
import com.example.backendagile.dto.PromotionDTO;
import com.example.backendagile.entities.Formation;
import com.example.backendagile.entities.Promotion;
import com.example.backendagile.services.FormationService;
import com.example.backendagile.services.PromotionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Optional;


/**
 * REST controller for managing promotions and related operations.
 */
@RestController
@RequestMapping("/api/promotions")
public class PromotionController {


    private final PromotionService promotionService;
    private final FormationService formationService;
    /**
     * Constructor to initialize services for promotions and formations.
     *
     * @param promotionService the service for managing promotions
     * @param formationService the service for managing formations
     */
    public PromotionController(PromotionService promotionService, FormationService formationService) {
        this.promotionService = promotionService;
        this.formationService = formationService;
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

    /**
     * Retrieves a promotion by its ID.
     *
     * @param anneeUniversitaire the ID of the promotion to retrieve
     * @return a {@link ResponseEntity} containing the promotion, or a 404 status if not found
     */
    @GetMapping("/{anneeUniversitaire}/{codeFormation}")
    public PromotionDTO getPromotionById(@PathVariable String anneeUniversitaire, @PathVariable String codeFormation) {
        PromotionDTO promotion = promotionService.getPromotionById(anneeUniversitaire, codeFormation);
        // System.out.println(anneeUniversitaire + " &&& " + codeFormation);
        return promotion;
    }

    /**
     * Creates a new promotion.
     *
     * @param promotion the {@link PromotionDTO} containing the details of the new promotion
     * @return a {@link ResponseEntity} containing the created {@link Promotion}
     */
    @PostMapping
    public ResponseEntity<Promotion> createPromotion(@RequestBody PromotionDTO promotion) {
        Promotion savedPromotion = promotionService.createPromotion(promotion);
        return ResponseEntity.ok(savedPromotion);
    }


    @PutMapping("/{anneeUniversitaire}/{codeFormation}")
    public PromotionDTO updatePromotion(@PathVariable String anneeUniversitaire, @PathVariable String codeFormation, @RequestBody PromotionDTO promotion) {

        PromotionDTO updatedPromotion = promotionService.updatePromotion(anneeUniversitaire,codeFormation, promotion);
        return updatedPromotion;
    }

    /**
     * Deletes a promotion by its ID.
     *
     * @param anneeUniversitaire the ID of the promotion to delete
     * @return a {@link ResponseEntity} with a 204 status upon successful deletion
     */
    @DeleteMapping("/{anneeUniversitaire}/{codeFormation}")
    public ResponseEntity<?> deletePromotion(@PathVariable String anneeUniversitaire, @PathVariable String codeFormation) {
        try{
            promotionService.deletePromotion(anneeUniversitaire,codeFormation);
            return new ResponseEntity<>("deleted", HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>("not deleted", HttpStatus.CONFLICT);
        }
    }



}