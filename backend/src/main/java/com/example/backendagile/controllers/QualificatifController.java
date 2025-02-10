package com.example.backendagile.controllers;

import com.example.backendagile.dto.QualificatifDTO;
import com.example.backendagile.entities.Qualificatif;
import com.example.backendagile.mapper.QualificatifMapper;
import com.example.backendagile.services.QualificatifService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/qualificatifs")
public class QualificatifController {

    @Autowired
    private QualificatifService qualificatifService;

    @Autowired
    private QualificatifMapper qualificatifMapper;

    /**
     * 🔹 Récupérer tous les qualificatifs (retourne `Qualificatif` directement)
     */
    @GetMapping
    public ResponseEntity<List<Qualificatif>> getAllQualificatifs() {
        List<Qualificatif> qualificatifs = qualificatifService.findAll();
        return ResponseEntity.ok(qualificatifs);
    }

    /**
     * 🔹 Récupérer un qualificatif par son ID (retourne `Qualificatif` directement)
     */
    @GetMapping("/{id}")
    public ResponseEntity<Qualificatif> getQualificatifById(@PathVariable Long id) {
        Optional<Qualificatif> qualificatif = qualificatifService.findById(id);
        return qualificatif.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * 🔸 Créer un nouveau qualificatif (utilise `QualificatifDTO` pour la requête)
     */
    @PostMapping
    public ResponseEntity<Qualificatif> createQualificatif(@RequestBody QualificatifDTO qualificatifDTO) {
        Qualificatif qualificatif = qualificatifMapper.toEntity(qualificatifDTO);
        Qualificatif savedQualificatif = qualificatifService.save(qualificatif);
        return ResponseEntity.status(201).body(savedQualificatif);
    }

    /**
     * 🔸 Mettre à jour un qualificatif existant (utilise `QualificatifDTO` pour la requête)
     */
    @PutMapping("/{id}")
    public ResponseEntity<String> updateQualificatif(@PathVariable Long id, @RequestBody QualificatifDTO qualificatifDTO) {
        if (!qualificatifService.findById(id).isPresent()) {
            return ResponseEntity.status(404).body("Aucun qualificatif trouvé avec cet ID.");
        }
        Qualificatif qualificatif = qualificatifMapper.toEntity(qualificatifDTO);
        qualificatif.setId(id);
        qualificatifService.save(qualificatif);
        return ResponseEntity.ok("Le qualificatif a bien été mis à jour.");
    }

    /**
     * 🔹 Supprimer un qualificatif par son ID (retourne `Qualificatif` directement)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteQualificatif(@PathVariable Long id) {
        if (!qualificatifService.findById(id).isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucun qualificatif trouvé avec cet ID.");
        }
        try {
            qualificatifService.deleteById(id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Qualificatif deja utilisé.");
        }
        return ResponseEntity.ok("Qualificatif supprimé avec succès.");
    }
}
