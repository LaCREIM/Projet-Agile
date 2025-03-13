package com.example.backendagile.services;

import com.example.backendagile.dto.RubriqueStdDTO;
import com.example.backendagile.entities.Enseignant;
import com.example.backendagile.entities.Qualificatif;
import com.example.backendagile.entities.Rubrique;
import com.example.backendagile.mapper.RubriqueStdMapper;
import com.example.backendagile.repositories.RubriqueStdRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Comparator;
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
    return rubriqueRepository.findByType("RBS")
            .stream()
            .sorted(Comparator.comparing(Rubrique::getDesignation, String.CASE_INSENSITIVE_ORDER))
            .collect(Collectors.toList());
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

    public Optional<Rubrique> findByDesignation(String designation) {
        return rubriqueRepository.findRubriqueByDesignation(designation).stream().findFirst();
    }

    public Optional<Rubrique> findByDesignationAndDiffrentID(Long id , String des){
        return rubriqueRepository.findRubriqueByDesignationAndDiffrentID(id,des).stream().findFirst();
    }
    /**
     * Supprimer une rubrique standard par ID
     */
    public void deleteById(Long id) {
        rubriqueRepository.deleteById(id);
    }

    public List<Rubrique> searchRubriquePaged(String keyword, int page, int size) {
        int startRow = (page - 1) * size;
        int endRow = page * size;
        String formattedKeyword = "%" + keyword + "%";
        return rubriqueRepository.searchRubriqueWithPagination(formattedKeyword, startRow, endRow);
    }

    public int getTotalPagesForSearch(String keyword, int size) {
        long totalCount = rubriqueRepository.countByDesignationContainingIgnoreCase(keyword);
        return (int) Math.ceil((double) totalCount / size);
    }

    public List<Rubrique> getAllRubriquesPaged(int page, int size) {
        int startRow = (page - 1) * size;
        int endRow = page * size;
        return rubriqueRepository.findAllWithPagination(startRow, endRow);
    }

    public int getTotalPages(int size) {
        long totalItems = rubriqueRepository.count();
        return (int) Math.ceil((double) totalItems / size);
    }

    public Boolean existsRubriqueInEvaluation(Long id) {
        return rubriqueRepository.existsRubriqueInEvaluation(id);
    }
}
