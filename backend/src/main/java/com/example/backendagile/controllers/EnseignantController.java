package com.example.backendagile.controllers;

import com.example.backendagile.dto.EnseignantDTO;
import com.example.backendagile.entities.Enseignant;
import com.example.backendagile.entities.Role;
import com.example.backendagile.mapper.EnseignantMapper;
import com.example.backendagile.services.AuthentificationService;
import com.example.backendagile.services.EnseignantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/enseignants")
public class EnseignantController {

    @Autowired
    private EnseignantService enseignantService;

    @Autowired
    private AuthentificationService authentificationService;

    @Autowired
    private EnseignantMapper enseignantMapper;

    /**
     * 🔹 Récupérer une liste paginée d'enseignants (retourne `Enseignant` directement) avec pagination
     */
    @GetMapping("/paged")
    public ResponseEntity<Map<String, Object>> getAllEnseignantsPaged(@RequestParam int page, @RequestParam int size) {
        List<Enseignant> enseignants = enseignantService.getEnseignantPaged(page, size);
        Map<String, Object> response = new HashMap<>();
        response.put("enseignants", enseignants);
        response.put("totalPages", enseignantService.getTotalPages(size));
        return ResponseEntity.ok(response);
    }

    /**
     * 🔹 Récupérer une liste paginée d'enseignants (retourne `Enseignant` directement)
     */
    @GetMapping
    public ResponseEntity<List<Enseignant>> getAllEnseignants() {
        List<Enseignant> enseignants = enseignantService.getEnseignant();
        return ResponseEntity.ok(enseignants);
    }


    @GetMapping("/search")
    public ResponseEntity<List<Enseignant>> getByNomAndPrenom(@RequestParam String nom, @RequestParam String prenom) {
        List<Enseignant> result = enseignantService.getByNomAndPrenom(nom, prenom);
        return ResponseEntity.ok(result);
    }

    /**
     * 🔹 Récupérer un enseignant par son ID (retourne `Enseignant` directement)
     */
    @GetMapping("/{id}")
    public ResponseEntity<Enseignant> getEnseignantById(@PathVariable Long id) {
        Optional<Enseignant> enseignant = enseignantService.findById(id);
        return enseignant.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * 🔸 Créer un nouvel enseignant (utilise `EnseignantDTO` pour la requête)
     */
    @PostMapping
    @Transactional
    public ResponseEntity<String> createEnseignant(@Valid @RequestBody EnseignantDTO enseignantDTO) {
        try {
            // Check if an Enseignant with the same emailUBO already exists
            Optional<Enseignant> existingEnseignant = enseignantService.findByEmailUbo(enseignantDTO.getEmailUbo().trim());
            if (existingEnseignant.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("L'email UBO existe déjà ! Veuillez en choisir un autre."); // Return 409 Confli40ct if the Enseignant already exists
            }
            // Check if an Enseignant with the same email Personel already exists
            Optional<Enseignant> existingEnseignant2 = enseignantService.findByEmailPerso(enseignantDTO.getEmailPerso().trim());
            if (existingEnseignant2.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("L'email Personnel existe déjà ! Veuillez en choisir un autre."); // Return 409 Conflict if the Enseignant already exists
            }
            Enseignant enseignant = enseignantMapper.toEntity(enseignantDTO);
            Enseignant savedEnseignant = enseignantService.save(enseignant);
            String pseudo = savedEnseignant.getNom().substring(0, 2) + " " + savedEnseignant.getPrenom().substring(0, 2);
            pseudo = pseudo.toUpperCase();

            // Create authentication for the new student
            authentificationService.save(
                    String.valueOf(Role.ENS),
                    savedEnseignant.getEmailUbo(),
                    pseudo,
                    enseignantDTO.getMotPasse(),
                    enseignant,
                    null
            );
            return ResponseEntity.status(HttpStatus.CREATED).body("Enseignant créé avec succès.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * 🔸 Mettre à jour un enseignant existant (utilise `EnseignantDTO` pour la requête)
     */
    @PutMapping("/{id}")
    public ResponseEntity<Enseignant> updateEnseignant(@PathVariable Long id, @RequestBody EnseignantDTO enseignantDTO) {
        Optional<Enseignant> existingEnseignant = enseignantService.findById(id);
        if (existingEnseignant.isPresent()) {
            Enseignant updatedEnseignant = enseignantMapper.toEntity(enseignantDTO);
            updatedEnseignant.setId(id);
            enseignantService.save(updatedEnseignant);
            return ResponseEntity.ok(updatedEnseignant);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 🔹 Supprimer un enseignant par son ID
     */

   /* @DeleteMapping("/{id}")
public ResponseEntity<?> deleteEnseignant(@PathVariable Long id) {
    Optional<Enseignant> enseignant = enseignantService.findById(id);
    
    if (enseignant.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("L'enseignant avec l'ID " + id + " n'existe pas.");
    }
    try {
        enseignantService.deleteById(id);
        return ResponseEntity.noContent().build(); 
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la suppression : " + e.getMessage());
    }
}*/
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEnseignant(@PathVariable Long id) {
        Optional<Enseignant> enseignant = enseignantService.findById(id);

        if (enseignant.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("L'enseignant avec l'ID " + id + " n'existe pas.");
        }

        try {
            enseignantService.deleteById(id);
            return ResponseEntity.ok("L'enseignant avec l'ID " + id + " a été supprimé avec succès.");
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Cet enseignant est responsable d'une promotion et ne peut pas être supprimé.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la suppression : " + e.getMessage());
        }
    }


}
