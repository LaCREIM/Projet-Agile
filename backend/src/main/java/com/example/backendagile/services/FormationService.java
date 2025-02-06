package com.example.backendagile.services;

import com.example.backendagile.entities.Formation;
import com.example.backendagile.repositories.FormationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FormationService {
    private final FormationRepository formationRepository;

    public FormationService(FormationRepository formationRepository) {
        this.formationRepository = formationRepository;
    }


    public List<Formation> getAllFormations() {
        return formationRepository.findAll();
    }
}