package com.example.backendagile.controllers;

import com.example.backendagile.dto.EtudiantDTO;
import com.example.backendagile.entities.Etudiant;
import com.example.backendagile.entities.Role;
import com.example.backendagile.mapper.EtudiantMapper;
import com.example.backendagile.services.AuthentificationService;
import com.example.backendagile.services.EtudiantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/etudiants")
public class EtudiantController {

    @Autowired
    private EtudiantService etudiantService;

    @Autowired
    private AuthentificationService authentificationService;
    @Autowired
    private EtudiantMapper etudiantMapper;

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
    @Transactional
    public ResponseEntity<String> createEtudiant(@Valid @RequestBody EtudiantDTO etudiantDTO) {
        try {
            // Check if an Etudiant with the same email already exists
            Optional<Etudiant> existingEtudiant = etudiantService.findByEmail(etudiantDTO.getEmail());
            if (existingEtudiant.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Un étudiant avec cet email existe déjà."); // Return 409 Conflict if the Etudiant already exists
            }

            EtudiantDTO savedEtudiant = etudiantService.save(etudiantDTO);
            if (savedEtudiant == null) {
                throw new RuntimeException("Erreur lors de la création de l'étudiant.");
            }
            String pseudo = savedEtudiant.getNom().substring(0, 2) + " " + savedEtudiant.getPrenom().substring(0, 2);
            pseudo = pseudo.toUpperCase();

            // Create authentication for the new student
            authentificationService.save(
                    String.valueOf(Role.ETU),
                    savedEtudiant.getEmail(),
                    pseudo,
                    etudiantDTO.getMotPasse(),
                    null,
                    etudiantMapper.toEntity(savedEtudiant, null)
            );

            return ResponseEntity.status(HttpStatus.CREATED).body("Étudiant créé avec succès.");
        } catch (RuntimeException e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur lors de la création de l'étudiant.");
        }
    }

    /**
     * Mettre à jour un étudiant existant
     */
    @PutMapping("/{id}")
    public ResponseEntity<String> updateEtudiant(@PathVariable String id, @RequestBody EtudiantDTO etudiantDTO) {
        if (etudiantService.findById(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Étudiant non trouvé avec cet ID.");
        }
        try {
            EtudiantDTO updatedEtudiant = etudiantService.update(id, etudiantDTO);
            return ResponseEntity.ok("Étudiant mis à jour avec succès.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur lors de la mise à jour de l'étudiant. " + e.getMessage());
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
    @GetMapping("/search")
    public ResponseEntity<List<Etudiant>> getByNomAndPrenom(@RequestParam String nom, @RequestParam String prenom) {
        List<Etudiant> result = etudiantService.getByNomAndPrenom(nom, prenom);
        return ResponseEntity.ok(result);
    }

}

