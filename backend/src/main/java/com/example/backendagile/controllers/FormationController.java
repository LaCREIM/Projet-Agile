package com.example.backendagile.controllers;


import com.example.backendagile.entities.Formation;
import com.example.backendagile.services.FormationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing formations.
 */
@RestController
@RequestMapping("/api/formations")
public class FormationController {

    private final FormationService formationService;

    public FormationController(FormationService formationService) {
        this.formationService = formationService;
    }

    /**
     * Retrieves all formations.
     *
     * @return a list of all {@link Formation} objects
     */
    @GetMapping
    public List<Formation> getAllFormations() {
        return formationService.getAllFormations();
    }



}
