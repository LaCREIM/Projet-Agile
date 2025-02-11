package com.example.backendagile.services;

import com.example.backendagile.dto.RubriqueStdDTO;
import com.example.backendagile.entities.Rubrique;
import com.example.backendagile.mapper.RubriqueStdMapper;
import com.example.backendagile.repositories.RubriqueStdRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RubriqueStdService {

    @Autowired
    private RubriqueStdRepository rubriqueRepository;

    @Autowired
    private RubriqueStdMapper rubriqueStdMapper;

    /**
     * Récupérer toutes les rubriques standards
     */
    public List<Rubrique> getStandardRubriques() {
        return rubriqueRepository.findByType("RBS");
    }

    /**
     * Récupérer une rubrique standard par ID 
     */
    public Optional<Rubrique> findById(Long id) {
        return rubriqueRepository.findById(id);
    }

    /**
     * Créer une nouvelle rubrique standard 
     */
    public RubriqueStdDTO createStandardRubrique(RubriqueStdDTO rubriqueStdDTO) {
        Rubrique rubrique = rubriqueStdMapper.toEntity(rubriqueStdDTO);
        rubriqueRepository.save(rubrique);
        return rubriqueStdDTO;
    }

    /**
     * Mettre à jour une rubrique standard existante 
     */
    public Rubrique updateStandardRubrique(Long id, String newDesignation) {
        Optional<Rubrique> existingRubriqueOpt = rubriqueRepository.findById(id);
        if (existingRubriqueOpt.isEmpty()) {
            throw new IllegalArgumentException("Aucune rubrique trouvée avec cet ID.");
        }

        Rubrique rubrique = existingRubriqueOpt.get();
        rubrique.setDesignation(newDesignation);

        return rubriqueRepository.save(rubrique);
    }

    /**
     * Supprimer une rubrique standard par ID
     */
    public void deleteById(Long id) {
        rubriqueRepository.deleteById(id);
    }
}
