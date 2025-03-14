package com.example.backendagile.services;

import com.example.backendagile.dto.RubriqueDTO;
import com.example.backendagile.entities.Rubrique;
import com.example.backendagile.mapper.RubriqueMapper;
import com.example.backendagile.repositories.RubriqueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.stream.Collectors;

@Service
public class RubriqueService {

    private final RubriqueRepository rubriqueRepository;
    private final RubriqueMapper rubriqueMapper;

    public RubriqueService(RubriqueRepository rubriqueRepository, RubriqueMapper rubriqueMapper) {
        this.rubriqueRepository = rubriqueRepository;
        this.rubriqueMapper = rubriqueMapper;
    }

    // Récupérer toutes les rubriques sans pagination
    public List<RubriqueDTO> getRubriques() {
        return rubriqueRepository.findAll().stream()
                .map(rubriqueMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Récupérer les rubriques paginées d'un enseignant
    public List<RubriqueDTO> getRubriquesPaged(long enseignantId, int page, int size) {
        int startRow = page * size;
        int endRow = startRow + size;

        List<Rubrique> rubriques = rubriqueRepository.findAllWithPagination(enseignantId, startRow, endRow);

        // Convertir les entités Rubrique en DTOs
        return rubriques.stream()
                .map(rubriqueMapper::toDTO) // Mapping vers DTO
                .collect(Collectors.toList());
    }

    public List<RubriqueDTO> getRubriques(long enseignantId) {

        List<Rubrique> rubriques = rubriqueRepository.findAll(enseignantId);

        // Convertir les entités Rubrique en DTOs
        return rubriques.stream()
                .map(rubriqueMapper::toDTO) // Mapping vers DTO
                .collect(Collectors.toList());
    }

    // 🔹 Ajouter une nouvelle rubrique (avec vérification d'existence)
    public RubriqueDTO createRubrique(RubriqueDTO dto) {
        // Vérifier si une rubrique avec la même désignation existe déjà
        rubriqueRepository.findByDesignation(dto.getDesignation())
                .ifPresent(r -> {
                    throw new IllegalArgumentException("Une rubrique avec cette désignation existe déjà.");
                });

        Rubrique rubrique = rubriqueMapper.toEntity(dto);
        rubrique = rubriqueRepository.save(rubrique);
        return rubriqueMapper.toDTO(rubrique);
    }


}

