package com.example.backendagile.controllers;

import com.example.backendagile.dto.EtudiantDTO;
import com.example.backendagile.entities.Etudiant;
import com.example.backendagile.entities.Role;
import com.example.backendagile.mapper.EtudiantMapper;
import com.example.backendagile.repositories.EtudiantRepository;
import com.example.backendagile.services.AuthentificationService;
import com.example.backendagile.services.EtudiantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    @Autowired
    private EtudiantRepository etudiantRepository;

    /**
     * Récupérer une liste paginée d'étudiants
     */
    @GetMapping("/paged")
    public ResponseEntity<Map<String, Object>> getAllEtudiants(@RequestParam int page, @RequestParam int size) {
        List<EtudiantDTO> etudiants = etudiantService.getEtudiantsPaged(page, size);
        Map<String, Object> response = new HashMap<>();
        response.put("etudiants", etudiants);
        response.put("totalPages", etudiantService.getTotalPages(size));
        return ResponseEntity.ok(response);
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
    public ResponseEntity<String> createEtudiant(@Valid @RequestBody EtudiantDTO etudiantDTO) {
        try {
            // Check if an Etudiant with the same Id already exists
            Optional<Etudiant> existingEtudiant1 = etudiantRepository.findByNoEtudiant(etudiantDTO.getNoEtudiant().trim()).stream().findFirst();
            if (existingEtudiant1.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Le numéro d'étudiant existe déjà ! Veuillez en choisir un autre."); // Return 409 Conflict if the Etudiant already exists
            }

            // Check if an Etudiant with the same email already exists
            Optional<Etudiant> existingEtudiant = etudiantService.findByEmail(etudiantDTO.getEmail().trim());
            if (existingEtudiant.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("L'email Personnel existe déjà ! Veuillez en choisir un autre."); // Return 409 Conflict if the Etudiant already exists
            }

            // Check if an Etudiant with the same email already exists
            Optional<Etudiant> existingEtudiant2 = etudiantService.findByEmail(etudiantDTO.getEmailUbo().trim());
            if (existingEtudiant2.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("L'email UBO existe déjà ! Veuillez en choisir un autre."); // Return 409 Conflict if the Etudiant already exists
            }

            EtudiantDTO savedEtudiant = etudiantService.save(etudiantDTO); // Save the Etudiant entity first
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
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
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

            // Check if an Etudiant with the same email already exists
            Optional<Etudiant> existingEtudiant = etudiantService.findByEmailandId(etudiantDTO.getEmail().trim(), etudiantDTO.getNoEtudiant().trim());
            if (existingEtudiant.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("L'email existe déjà ! Veuillez en choisir un autre."); // Return 409 Conflict if the Etudiant already exists
            }
             etudiantService.update(id, etudiantDTO);
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
public ResponseEntity<List<Etudiant>> searchEtudiants(@RequestParam String keyword) {
    List<Etudiant> result = etudiantService.searchEtudiants(keyword);
    return ResponseEntity.ok(result);
}

}

