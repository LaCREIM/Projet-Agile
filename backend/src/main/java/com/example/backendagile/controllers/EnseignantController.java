package com.example.backendagile.controllers;

import com.example.backendagile.entities.Enseignant;
import com.example.backendagile.services.EnseignantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import javax.validation.Valid;
import java.util.Optional;

@RestController
@RequestMapping("/api/enseignants")
public class EnseignantController {

    private final EnseignantService enseignantService;

    @Autowired
    public EnseignantController(EnseignantService enseignantService) {
        this.enseignantService = enseignantService;
    }

    @GetMapping
    public Page<Enseignant> getAllEnseignants(@RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return enseignantService.findAllWithPagination(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Enseignant> getEnseignantById(@PathVariable Long id) {
        Optional<Enseignant> enseignant = enseignantService.findById(id);
        return enseignant.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Enseignant> createEnseignant(@Valid @RequestBody Enseignant enseignant) {
        Enseignant savedEnseignant = enseignantService.save(enseignant);
        return ResponseEntity.ok(savedEnseignant);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Enseignant> updateEnseignant(@PathVariable Long id, @Valid @RequestBody Enseignant enseignantDetails) {
        Optional<Enseignant> enseignant = enseignantService.findById(id);
        if (enseignant.isPresent()) {
            Enseignant updatedEnseignant = enseignant.get();
            updatedEnseignant.setNom(enseignantDetails.getNom());
            updatedEnseignant.setPrenom(enseignantDetails.getPrenom());
            updatedEnseignant.setAdresse(enseignantDetails.getAdresse());
            updatedEnseignant.setSexe(enseignantDetails.getSexe());
            updatedEnseignant.setVille(enseignantDetails.getVille());
            updatedEnseignant.setPays(enseignantDetails.getPays());
            updatedEnseignant.setMobile(enseignantDetails.getMobile());
            updatedEnseignant.setTelephone(enseignantDetails.getTelephone());
            updatedEnseignant.setCodePostal(enseignantDetails.getCodePostal());
            updatedEnseignant.setType(enseignantDetails.getType());
            updatedEnseignant.setEmailUbo(enseignantDetails.getEmailUbo());
            updatedEnseignant.setEmailPerso(enseignantDetails.getEmailPerso());
            enseignantService.save(updatedEnseignant);
            return ResponseEntity.ok(updatedEnseignant);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnseignant(@PathVariable Long id) {
        if (enseignantService.findById(id).isPresent()) {
            enseignantService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}