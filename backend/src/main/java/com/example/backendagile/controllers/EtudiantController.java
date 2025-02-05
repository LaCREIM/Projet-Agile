package com.example.backendagile.controllers;

import com.example.backendagile.entities.Etudiant;
import com.example.backendagile.services.EtudiantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/etudiants")
public class EtudiantController {

    @Autowired
    private EtudiantService etudiantService;

    @GetMapping
    public List<Etudiant> getAllEtudiants() {
        return etudiantService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Etudiant> getEtudiantById(@PathVariable Long id) {
        Optional<Etudiant> etudiant = etudiantService.findById(id);
        return etudiant.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Etudiant createEtudiant(@RequestBody Etudiant etudiant) {
        return etudiantService.save(etudiant);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Etudiant> updateEtudiant(@PathVariable Long id, @RequestBody Etudiant etudiantDetails) {
        Optional<Etudiant> etudiant = etudiantService.findById(id);
        if (etudiant.isPresent()) {
            Etudiant updatedEtudiant = etudiant.get();
            updatedEtudiant.setNom(etudiantDetails.getNom());
            updatedEtudiant.setPrenom(etudiantDetails.getPrenom());
            updatedEtudiant.setSexe(etudiantDetails.getSexe());
            updatedEtudiant.setDateNaissance(etudiantDetails.getDateNaissance());
            updatedEtudiant.setLieuNaissance(etudiantDetails.getLieuNaissance());
            updatedEtudiant.setNationalite(etudiantDetails.getNationalite());
            // updatedEtudiant.setPromotion(etudiantDetails.getPromotion());
            etudiantService.save(updatedEtudiant);
            return ResponseEntity.ok(updatedEtudiant);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEtudiant(@PathVariable Long id) {
        if (etudiantService.findById(id).isPresent()) {
            etudiantService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}