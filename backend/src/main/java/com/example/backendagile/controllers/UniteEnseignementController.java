package com.example.backendagile.controllers;
import com.example.backendagile.dto.UniteEnseignementDTO;
import com.example.backendagile.services.UniteEnseignementService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/unites-enseignement")
public class UniteEnseignementController {

    private final UniteEnseignementService uniteEnseignementService;

    public UniteEnseignementController(UniteEnseignementService uniteEnseignementService) {
        this.uniteEnseignementService = uniteEnseignementService;
    }

    @GetMapping
    public List<UniteEnseignementDTO> getAllUnitesEnseignement() {
        return uniteEnseignementService.getAllUnitesEnseignement();
    }

    @GetMapping("/enseignant/{noEnseignant}")
    public List<UniteEnseignementDTO> getUnitesEnseignementByEnseignant(@PathVariable Long noEnseignant) {
        List<UniteEnseignementDTO> ues =  uniteEnseignementService.getUnitesEnseignementByPromotion(noEnseignant);
        if(ues==null || ues.isEmpty()){
                ues = new ArrayList<>();
        }
        return ues;
    }
}

