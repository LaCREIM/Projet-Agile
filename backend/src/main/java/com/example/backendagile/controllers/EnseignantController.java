package com.example.backendagile.controllers;

import com.example.backendagile.dto.EnseignantDTO;
import com.example.backendagile.entities.Enseignant;
import com.example.backendagile.mapper.EnseignantMapper;
import com.example.backendagile.services.EnseignantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
//import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/enseignants")
public class EnseignantController {

    @Autowired
    private EnseignantService enseignantService;

    @Autowired
    private EnseignantMapper enseignantMapper;

    /**
     * 🔹 Récupérer une liste paginée d'enseignants (retourne `Enseignant` directement)
     */
    @GetMapping
    public ResponseEntity<List<Enseignant>> getAllEnseignants(@RequestParam int page, @RequestParam int size) {
        List<Enseignant> enseignants = enseignantService.getEnseignantPaged(page, size);
        return ResponseEntity.ok(enseignants);
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
    public ResponseEntity<Enseignant> createEnseignant(@RequestBody EnseignantDTO enseignantDTO) {
        try {
            Enseignant enseignant = enseignantMapper.toEntity(enseignantDTO);
            Enseignant savedEnseignant = enseignantService.save(enseignant);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedEnseignant);
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
     * 🔹 Supprimer un enseignant par son ID (retourne `Enseignant` directement)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEnseignant(@PathVariable Long id) {
        if (enseignantService.findById(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucun enseignant trouvé avec cet ID.");
        }
        enseignantService.deleteById(id);
        return ResponseEntity.ok("Enseignant supprimé avec succès.");
    }
}
