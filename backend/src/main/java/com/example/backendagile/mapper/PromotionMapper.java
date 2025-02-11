package com.example.backendagile.mapper;
import com.example.backendagile.dto.PromotionDTO;
import com.example.backendagile.entities.Enseignant;
import com.example.backendagile.entities.Promotion;
import com.example.backendagile.entities.PromotionId;
import com.example.backendagile.repositories.FormationRepository;
import com.example.backendagile.services.EnseignantService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class PromotionMapper {

    private final EnseignantService enseignantService;

    private final FormationRepository formationRepository;

    public PromotionMapper(EnseignantService enseignantService, FormationRepository formationRepository) {
        this.enseignantService = enseignantService;
        this.formationRepository = formationRepository;
    }

    public PromotionDTO fromPromotion(Promotion promotion)
    {
        PromotionDTO newPromotion = new PromotionDTO();
        BeanUtils.copyProperties(promotion,newPromotion);

        System.out.println(promotion);
        newPromotion.setCodeFormation(promotion.getId().getCodeFormation());
        newPromotion.setAnneeUniversitaire(promotion.getId().getAnneeUniversitaire());
        newPromotion.setDiplome(formationRepository.findDiplomeByCodeFormation(promotion.getId().getCodeFormation()).orElse(null));
        newPromotion.setNomFormation(formationRepository.findNomByCodeFormation(promotion.getId().getCodeFormation()).orElse(null));
        if(promotion.getEnseignant()!=null){
            newPromotion.setNoEnseignant((promotion.getEnseignant().getId()).longValue());
            newPromotion.setType(promotion.getEnseignant().getType());
            newPromotion.setNom(promotion.getEnseignant().getNom());
            newPromotion.setPrenom(promotion.getEnseignant().getPrenom());
            newPromotion.setEmailEnseignant(promotion.getEnseignant().getEmailUbo());
        }
        return  newPromotion;
    }


    public Promotion fromPromotionDTO(PromotionDTO promotionDTO) {
        if (promotionDTO == null) {
            return null;
        }

        Promotion newPromotion = new Promotion();

        // Mapping manuel des attributs
        newPromotion.setSiglePromotion(promotionDTO.getSiglePromotion());
        newPromotion.setNbMaxEtudiant(promotionDTO.getNbMaxEtudiant());
        newPromotion.setDateReponseLp(promotionDTO.getDateReponseLp());
        newPromotion.setDateReponseLalp(promotionDTO.getDateReponseLalp());
        newPromotion.setDateRentree(promotionDTO.getDateRentree());
        newPromotion.setLieuRentree(promotionDTO.getLieuRentree());
        newPromotion.setProcessusStage(promotionDTO.getProcessusStage());
        newPromotion.setCommentaire(promotionDTO.getCommentaire());

        // Gestion de l'ID (PromotionId)
        PromotionId promotionId = new PromotionId();
        promotionId.setAnneeUniversitaire(promotionDTO.getAnneeUniversitaire());
        promotionId.setCodeFormation(promotionDTO.getCodeFormation());
        newPromotion.setId(promotionId);

        // Gestion de l'enseignant
        if (promotionDTO.getNoEnseignant() != null && promotionDTO.getNoEnseignant() > 0) {
            Optional<Enseignant> enseignant = enseignantService.findById(promotionDTO.getNoEnseignant());
            newPromotion.setEnseignant(enseignant.orElse(null));
        }

        System.out.println("Mapping from PromotionDTO to Promotion: " + promotionDTO + " -> " + newPromotion);

        return newPromotion;
    }

}