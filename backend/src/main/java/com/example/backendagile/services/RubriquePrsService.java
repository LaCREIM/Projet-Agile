package com.example.backendagile.services;

import com.example.backendagile.dto.RubriquePrsDTO;
import com.example.backendagile.entities.Rubrique;
import com.example.backendagile.mapper.RubriquePrsMapper;
import com.example.backendagile.repositories.RubriquePrsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RubriquePrsService {

    private final RubriquePrsRepository rubriqueRepository;
    private final RubriquePrsMapper rubriqueMapper;
    public RubriquePrsService(RubriquePrsRepository rubriqueRepository, RubriquePrsMapper rubriqueMapper) {
        this.rubriqueRepository = rubriqueRepository;
        this.rubriqueMapper = rubriqueMapper;
    }

    // Récupérer toutes les rubriques
    public List<RubriquePrsDTO> getAllRubriques() {
        List<Rubrique> rubriques = rubriqueRepository.findAll();
        return rubriques.stream()
                .map(rubriqueMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Récupérer une rubrique par son ID
    public RubriquePrsDTO getRubriqueById(Long id) {
        Rubrique rubrique = rubriqueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rubrique non trouvée avec l'ID : " + id));
        return rubriqueMapper.toDTO(rubrique);
    }

    // Ajouter une nouvelle rubrique
    public RubriquePrsDTO createRubrique(RubriquePrsDTO dto) {
        Rubrique rubrique = rubriqueMapper.toEntity(dto);
        rubrique = rubriqueRepository.save(rubrique);
        return rubriqueMapper.toDTO(rubrique);
    }

    // Mettre à jour une rubrique existante
    public RubriquePrsDTO updateRubrique(Long id, RubriquePrsDTO dto) {
        Rubrique rubrique = rubriqueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rubrique non trouvée avec l'ID : " + id));

        rubrique.setDesignation(dto.getDesignation());
        rubrique.setOrdre(dto.getOrdre());

        rubrique = rubriqueRepository.save(rubrique);
        return rubriqueMapper.toDTO(rubrique);
    }

    // Supprimer une rubrique par ID
    public void deleteRubrique(Long id) {
        if (!rubriqueRepository.existsById(id)) {
            throw new RuntimeException("Rubrique non trouvée avec l'ID : " + id);
        }
        rubriqueRepository.deleteById(id);
    }
    // ✅ Récupérer les rubriques d'un enseignant spécifique
    public List<RubriquePrsDTO> getRubriquesByEnseignant(Long noEnseignant) {
        List<Rubrique> rubriques = rubriqueRepository.findByNoEnseignant_NoEnseignant(noEnseignant);
        return rubriques.stream()
                .map(rubriqueMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<Rubrique> searchRubriquePaged(String keyword, Long noEnseignat, int page, int size) {
        int startRow = (page - 1) * size;
        int endRow = page * size;
        String formattedKeyword = "%" + keyword + "%";
        return rubriqueRepository.searchRubriqueWithPagination(formattedKeyword,noEnseignat, startRow, endRow);
    }

    public int getTotalPagesForSearch(String keyword, int size) {
        long totalCount = rubriqueRepository.countByDesignationContainingIgnoreCase(keyword);
        return (int) Math.ceil((double) totalCount / size);
    }

    public List<Rubrique> getAllRubriquesPaged(long noEnseignant, int page, int size) {
        int startRow = (page - 1) * size;
        int endRow = page * size;
        return rubriqueRepository.findAllWithPagination(noEnseignant,startRow, endRow);
    }

    public int getTotalPages(int size) {
        long totalItems = rubriqueRepository.count();
        return (int) Math.ceil((double) totalItems / size);
    }
}
