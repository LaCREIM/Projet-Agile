package com.example.backendagile.controllers;

import com.example.backendagile.dto.QualificatifDTO;
import com.example.backendagile.entities.Qualificatif;
import com.example.backendagile.entities.Rubrique;
import com.example.backendagile.mapper.QualificatifMapper;
import com.example.backendagile.services.QualificatifService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import org.springframework.data.domain.Page;

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
    public ResponseEntity<String> createQualificatif(@RequestBody QualificatifDTO qualificatifDTO) {

        try{
            Optional<Qualificatif> existingQualificatif = qualificatifService.findByMinimalAndMaximal(qualificatifDTO.getMinimal().trim(), qualificatifDTO.getMaximal().trim());
            if(existingQualificatif.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Le qualificatif existe déjà.");
            }

            Qualificatif qualificatif = qualificatifMapper.toEntity(qualificatifDTO);
            Qualificatif savedQualificatif = qualificatifService.save(qualificatif);
            return ResponseEntity.status(201).body("Le qualificatif a été créé avec succès.");
        } catch (Exception e) {
        return ResponseEntity.badRequest().build();
    }


    }

    /**
     * 🔸 Mettre à jour un qualificatif existant (utilise `QualificatifDTO` pour la requête)
     */
    @PutMapping("/{id}")
    public ResponseEntity<String> updateQualificatif(@PathVariable Long id, @RequestBody QualificatifDTO qualificatifDTO) {
        if (!qualificatifService.findById(id).isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucun qualificatif trouvé avec cet ID.");
        }

        // Vérifier si le qualificatif est utilisé dans une question
        if (qualificatifService.existsDansEva(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Impossible de modifier ce qualificatif car il est utilisé dans une question.");
        }

        try {
            Optional<Qualificatif> existingQualificatif = qualificatifService.findByMinimalAndMaximal(
                    qualificatifDTO.getMinimal().trim(),
                    qualificatifDTO.getMaximal().trim()
            );

            if (existingQualificatif.isPresent() && !existingQualificatif.get().getId().equals(id)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Le qualificatif existe déjà.");
            }

            Qualificatif qualificatif = qualificatifMapper.toEntity(qualificatifDTO);
            qualificatif.setId(id);
            qualificatifService.save(qualificatif);
            return ResponseEntity.ok("Le qualificatif a bien été mis à jour.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Une erreur s'est produite lors de la mise à jour.");
        }
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
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Qualificatif déjà utilisé.");
        }
        return ResponseEntity.ok("Qualificatif supprimé avec succès.");
    }

    /**
     * 🔹 Vérifier si un qualificatif est utilisé dans une question (retourne `Boolean` directement)
     */
    @GetMapping("/{id}/exists")
    public ResponseEntity<Boolean> existsDansQuestion(@PathVariable Long id) {
        return ResponseEntity.ok(qualificatifService.existsDansQuestion(id));
    }
   

@GetMapping("/search-paged")
public ResponseEntity<Map<String, Object>> searchQualificatifsPaged(
        @RequestParam String keyword,
        @RequestParam int page,
        @RequestParam int size) {
    
    List<Qualificatif> qualificatifs = qualificatifService.searchQualificatifsPaged(keyword, page, size);
    int totalPages = qualificatifService.getTotalPagesForSearch(keyword, size);

    Map<String, Object> response = new HashMap<>();
    response.put("qualificatifs", qualificatifs);
    response.put("totalPages", totalPages);

    return ResponseEntity.ok(response);
}

@GetMapping("/paged")
public ResponseEntity<Map<String, Object>> getAllQualificatifsPaged(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int size) {

    List<Qualificatif> qualificatifs = qualificatifService.getAllQualificatifsPaged(page, size);
    
    Map<String, Object> response = new HashMap<>();
    response.put("qualificatifs", qualificatifs);
    response.put("currentPage", page);
    response.put("size", size);
    response.put("totalPages", qualificatifService.getTotalPages(size));

    return ResponseEntity.ok(response);
}


    @GetMapping("/estUtilisee/{id}")
    public Boolean estUtilise(@PathVariable Long id) {

        return  qualificatifService.existsDansEva(id);
    }
}
