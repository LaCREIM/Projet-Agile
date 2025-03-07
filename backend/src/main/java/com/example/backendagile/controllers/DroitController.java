package com.example.backendagile.controllers;


import com.example.backendagile.dto.DroitDTO;
import com.example.backendagile.entities.Droit;
import com.example.backendagile.entities.DroitId;
import com.example.backendagile.services.DroitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

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
    public ResponseEntity<String> createDroit(@RequestBody DroitDTO droitDTO) {
        try{
            Optional<Droit> existDroit = droitService.findById(new DroitId(droitDTO.getIdEvaluation(), droitDTO.getIdEnseignant()));

            if(existDroit.isPresent()){
                return ResponseEntity.badRequest().body("Droit déjà existant");
            }
            Droit createdDroit = droitService.createDroit(droitDTO);
            System.out.println("Droit créé : "+createdDroit);
            return ResponseEntity.ok("Droit créé avec succès");

        }catch (Exception e) {
            e.printStackTrace();  // Logs the error
            return ResponseEntity.badRequest().build();
        }



    }

    // ✏️ Mettre à jour un droit
    @PutMapping("/{idEvaluation}/{idEnseignant}")
    public ResponseEntity<String> updateDroit(
            @PathVariable Long idEvaluation,
            @PathVariable Long idEnseignant,
            @RequestBody DroitDTO droitDTO) {
        try{
            Droit updatedDroit = droitService.updateDroit(idEvaluation, idEnseignant, droitDTO);
            return ResponseEntity.ok("Droit mis à jour avec succès");
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }

    }

    // 🗑️ Supprimer un droit
    @DeleteMapping("/{idEvaluation}/{idEnseignant}")
    public ResponseEntity<String> deleteDroit(@PathVariable Long idEvaluation, @PathVariable Long idEnseignant) {

        try {
            droitService.deleteDroit(idEvaluation, idEnseignant);
            return ResponseEntity.ok().body("Droit supprimé avec succès");

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
        }
}
