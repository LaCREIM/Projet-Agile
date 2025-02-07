package com.example.backendagile.controllers;

import com.example.backendagile.dto.QualificatifDTO;
import com.example.backendagile.entities.Qualificatif;
import com.example.backendagile.mapper.QualificatifMapper;
import com.example.backendagile.services.QualificatifService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/qualificatifs")
public class QualificatifController {

    @Autowired
    private QualificatifService qualificatifService;

    @Autowired
    private QualificatifMapper qualificatifMapper;

    @GetMapping
    public List<QualificatifDTO> getAllQualificatifs() {
        return qualificatifService.findAll().stream()
                .map(qualificatifMapper::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<QualificatifDTO> getQualificatifById(@PathVariable Long id) {
        Optional<Qualificatif> qualificatif = qualificatifService.findById(id);
        return qualificatif.map(q -> ResponseEntity.ok(qualificatifMapper.toDto(q)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<QualificatifDTO> createQualificatif(@RequestBody QualificatifDTO qualificatifDTO) {
        Qualificatif qualificatif = qualificatifMapper.toEntity(qualificatifDTO);
        Qualificatif savedQualificatif = qualificatifService.save(qualificatif);
        return ResponseEntity.status(201).body(qualificatifMapper.toDto(savedQualificatif));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QualificatifDTO> updateQualificatif(@PathVariable Long id, @RequestBody QualificatifDTO qualificatifDTO) {
        if (!qualificatifService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Qualificatif qualificatif = qualificatifMapper.toEntity(qualificatifDTO);
        qualificatif.setId(id);
        Qualificatif updatedQualificatif = qualificatifService.save(qualificatif);
        return ResponseEntity.ok(qualificatifMapper.toDto(updatedQualificatif));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteQualificatif(@PathVariable Long id) {
        if (!qualificatifService.findById(id).isPresent()) {
            return ResponseEntity.status(404).body("Aucun qualificatif trouvé pour cet id.");
        }
        qualificatifService.deleteById(id);
        return ResponseEntity.ok("Le qualificatif a été supprimé avec succès.");
    }
}