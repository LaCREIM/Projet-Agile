package com.example.backendagile.controllers;

import com.example.backendagile.entities.Promotion;
import com.example.backendagile.entities.PromotionId;
import com.example.backendagile.services.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/promotions")
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

    @GetMapping
    public List<Promotion> getAllPromotions() {
        return promotionService.findAll();
    }

    @GetMapping("/{codeFormation}/{anneeUniversitaire}")
    public ResponseEntity<Promotion> getPromotionById(@PathVariable String codeFormation, @PathVariable String anneeUniversitaire) {
        PromotionId id = new PromotionId(codeFormation, anneeUniversitaire);
        Optional<Promotion> promotion = promotionService.findById(id);
        return promotion.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Promotion createPromotion(@RequestBody Promotion promotion) {
        return promotionService.save(promotion);
    }

    @PutMapping("/{codeFormation}/{anneeUniversitaire}")
    public ResponseEntity<Promotion> updatePromotion(@PathVariable String codeFormation,
                                                     @PathVariable String anneeUniversitaire,
                                                     @RequestBody Promotion promotionDetails) {
        PromotionId id = new PromotionId(codeFormation, anneeUniversitaire);
        Optional<Promotion> promotion = promotionService.findById(id);

        if (promotion.isPresent()) {
            Promotion updatedPromotion = promotion.get();
            updatedPromotion.setSiglePromotion(promotionDetails.getSiglePromotion());
            updatedPromotion.setNbMaxEtudiant(promotionDetails.getNbMaxEtudiant());
            updatedPromotion.setDateReponseLp(promotionDetails.getDateReponseLp());
            updatedPromotion.setDateReponseLalp(promotionDetails.getDateReponseLalp());
            updatedPromotion.setDateRentree(promotionDetails.getDateRentree());
            updatedPromotion.setLieuRentree(promotionDetails.getLieuRentree());
            updatedPromotion.setProcessusStage(promotionDetails.getProcessusStage());
            updatedPromotion.setCommentaire(promotionDetails.getCommentaire());
            promotionService.save(updatedPromotion);
            return ResponseEntity.ok(updatedPromotion);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{codeFormation}/{anneeUniversitaire}")
    public ResponseEntity<Void> deletePromotion(@PathVariable String codeFormation, @PathVariable String anneeUniversitaire) {
        PromotionId id = new PromotionId(codeFormation, anneeUniversitaire);
        if (promotionService.findById(id).isPresent()) {
            promotionService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

