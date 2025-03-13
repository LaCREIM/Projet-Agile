package com.example.backendagile.services;

import com.example.backendagile.dto.PromotionDTO;
import com.example.backendagile.entities.*;
import com.example.backendagile.mapper.PromotionMapper;
import com.example.backendagile.repositories.EnseignantRepository;
import com.example.backendagile.repositories.FormationRepository;
import com.example.backendagile.repositories.PromotionRepository;
import com.example.backendagile.repositories.UniteEnseignementRepository;
import org.springframework.stereotype.Service;


import java.util.*;
import java.util.stream.Collectors;

@Service
public class PromotionService {
    private final PromotionMapper promotionMapper;
    private final PromotionRepository promotionRepository;
    private final FormationRepository formationRepository;
    private final EnseignantRepository enseignantRepository;
    private final UniteEnseignementRepository uniteEnseignementRepository;

    public PromotionService(PromotionMapper promotionMapper, PromotionRepository promotionRepository, FormationRepository formationRepository, EnseignantRepository enseignantRepository, UniteEnseignementRepository uniteEnseignementRepository) {
        this.promotionMapper = promotionMapper;
        this.promotionRepository = promotionRepository;
        this.formationRepository = formationRepository;
        this.enseignantRepository = enseignantRepository;
        this.uniteEnseignementRepository = uniteEnseignementRepository;
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
        List<Promotion> promotions = promotionRepository.findAllPromotions();
        return promotions.stream().map(promotionMapper::fromPromotion).collect(Collectors.toList());
    }

    /**
     * Retrieves a specific promotion by its ID.
     *
     * @param anneeUniversitaire codeFormation The ID of the promotion to retrieve.
     * @return An {@link Optional} containing the {@link Promotion} if found, or empty if not found.
     */
    public PromotionDTO getPromotionById(String anneeUniversitaire, String codeFormation) {
        PromotionId key = new PromotionId(anneeUniversitaire, codeFormation);
        Optional<Promotion> promotion = promotionRepository.findById(key);
        return promotion.map(promotionMapper::fromPromotion).orElse(null);
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
        promotionRepository.findById(key).orElseThrow(() -> new RuntimeException("Promotion not found with id " + anneeUniversitaire));
        Enseignant enseignant = enseignantRepository.findById(updatedPromotion.getNoEnseignant()).orElseThrow(() -> new RuntimeException("Enseignant Not Found"));
        Promotion newpromotion = promotionMapper.fromPromotionDTO(updatedPromotion);
        newpromotion.setEnseignant(enseignant);
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

    public List<Promotion> searchPromotions(String keyword) {
        return promotionRepository.searchPromotions(keyword.toLowerCase());
    }

    public List<PromotionDTO> getPromotionsByEnseignantForEvaluation(Long noEnseignant) {
        //if the enseignant is a Responsable;
        List<Promotion> promotions = promotionRepository.findByNoEnseignant(noEnseignant);
        if(!promotions.isEmpty()){
            return promotions.stream().map(promotionMapper::fromPromotion).collect(Collectors.toList());
        }
        //is not a responsable
        List<UniteEnseignement> ues = uniteEnseignementRepository.findUniteEnseignementByNoEnseignant(noEnseignant);

        Set<String> uniqueCodes = new HashSet<>();
        // Extraction et insertion dans le Set pour rendre unique
        ues.forEach(ue -> uniqueCodes.add(ue.getCodeFormation().getCodeFormation()));
        System.out.println("List uniqueCodes : "+uniqueCodes);
        if(uniqueCodes.isEmpty()){
            return null;
        }
        List<Promotion> promotionsByEnseignant = new ArrayList<>() ;
        for(String codeFormation : uniqueCodes){
            List<Promotion> prm = promotionRepository.findByCodeFormationActuel(codeFormation);
            System.out.println("List Promotions prm : "+prm);
            if(!prm.isEmpty()){
                promotionsByEnseignant.addAll(prm);
            }
        }
        System.out.println("List PromotionsbyEnseignant : "+promotionsByEnseignant);
        List<PromotionDTO> prmDto= promotionsByEnseignant.stream().map(promotionMapper::fromPromotion).collect(Collectors.toList());
        if(prmDto.isEmpty()){
            return null;
        }
        return prmDto;

}
}