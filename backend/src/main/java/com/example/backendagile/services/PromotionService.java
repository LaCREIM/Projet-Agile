package com.example.backendagile.services;

import com.example.backendagile.dto.PromotionDTO;
import com.example.backendagile.entities.Enseignant;
import com.example.backendagile.entities.Formation;
import com.example.backendagile.entities.Promotion;
import com.example.backendagile.entities.PromotionId;
import com.example.backendagile.mapper.PromotionMapper;
import com.example.backendagile.repositories.EnseignantRepository;
import com.example.backendagile.repositories.FormationRepository;
import com.example.backendagile.repositories.PromotionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PromotionService {
    private final PromotionMapper promotionMapper;
    private final PromotionRepository promotionRepository;
    private final FormationRepository formationRepository;
    private final EnseignantRepository enseignantRepository;


    public PromotionService(PromotionMapper promotionMapper, PromotionRepository promotionRepository, FormationRepository formationRepository, EnseignantRepository enseignantRepository) {
        this.promotionMapper = promotionMapper;
        this.promotionRepository = promotionRepository;
        this.formationRepository = formationRepository;
        this.enseignantRepository = enseignantRepository;
    }

    public List<PromotionDTO> getPromotionsByName(String siglePromotion) {
        List<Promotion> promotions = promotionRepository.findByNameContaining(siglePromotion);
        return promotions.stream()
                .map(promotionMapper::fromPromotion)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves all promotions from the database.
     *
     * @return A list of {@link PromotionDTO} objects representing all promotions.
     */
    public List<PromotionDTO> getAllPromotions() {
        List<Promotion> promotions = promotionRepository.findAll();
        System.out.println(promotions);
        List<PromotionDTO> promotionDTOs = promotions.stream().map(pmt -> promotionMapper.fromPromotion(pmt)).collect(Collectors.toList());
        return promotionDTOs;
    }

    /**
     * Retrieves a specific promotion by its ID.
     *
     * @param anneeUniversitaire codeFormation The ID of the promotion to retrieve.
     * @return An {@link Optional} containing the {@link Promotion} if found, or empty if not found.
     */
    public PromotionDTO getPromotionById(String anneeUniversitaire, String codeFormation) {
        PromotionId key = new PromotionId(anneeUniversitaire, codeFormation);
        //System.out.println(key);
        Promotion promotion = promotionRepository.findById(key).orElseThrow(() -> new RuntimeException("Promotion Not Found"));
        return promotionMapper.fromPromotion(promotion);
    }

    /**
     * Creates a new promotion and saves it to the database.
     *
     * @param Promotion The {@link PromotionDTO} object containing the promotion's data.
     * @return The saved {@link Promotion} entity.
     * @throws RuntimeException If the associated formation or teacher is not found.
     */
    public Promotion createPromotion(PromotionDTO Promotion) {
        Promotion promotion = promotionMapper.fromPromotionDTO(Promotion);
        System.out.println("PromotionDTO : " + Promotion);
        System.out.println("Promotion : " + promotion);
        return promotionRepository.save(promotion);
    }

    /**
     * Updates an existing promotion in the database.
     *
     * @param anneeUniversitaire The ID of the promotion to update.
     * @param updatedPromotion   The {@link Promotion} object containing the updated data.
     * @return The updated {@link Promotion} entity.
     * @throws RuntimeException If the promotion with the given ID is not found.
     */
    public PromotionDTO updatePromotion(String anneeUniversitaire, String codeFormation, PromotionDTO updatedPromotion) {
        PromotionId key = new PromotionId(anneeUniversitaire, codeFormation);
        Promotion promotion = promotionRepository.findById(key).orElseThrow(() -> new RuntimeException("Promotion not found with id " + anneeUniversitaire));
        Enseignant enseignant = enseignantRepository.findById(updatedPromotion.getNoEnseignant()).orElseThrow(() -> new RuntimeException("Enseignant Not Found"));
        Promotion newpromotion = promotionMapper.fromPromotionDTO(updatedPromotion);
        newpromotion.setEnseignant(enseignant);
        PromotionId key2 = new PromotionId(updatedPromotion.getAnneeUniversitaire(), updatedPromotion.getCodeFormation());
        newpromotion.setId(key2);
        promotionRepository.save(newpromotion);
        return promotionMapper.fromPromotion(newpromotion);
    }

    /**
     * Deletes a promotion from the database.
     *
     * @param anneeUniversitaire The ID of the promotion to delete.
     */
    public void deletePromotion(String anneeUniversitaire, String codeFormation) {
        PromotionId key = new PromotionId(anneeUniversitaire, codeFormation);
        promotionRepository.deleteById(key);
    }


    public List<PromotionDTO> getPromotionPaged(int page, int size) {
        int startRow = (page - 1) * size;
        int endRow = page * size;
        List<Promotion> promotions = promotionRepository.findAllWithPagination(startRow, endRow);
        List<PromotionDTO> promotionDTOs = promotions.stream().map(pmt -> promotionMapper.fromPromotion(pmt)).collect(Collectors.toList());
        return promotionDTOs;
    }


}