package com.example.backendagile.mapper;
import com.example.backendagile.dto.PromotionDTO;
import com.example.backendagile.entities.Promotion;
import com.example.backendagile.repositories.FormationRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;


@Service
public class PromotionMapper {

    private final FormationRepository formationRepository;

    public PromotionMapper(FormationRepository formationRepository) {
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
        if(promotion.getEnseignant()!=null){
            newPromotion.setNoEnseignant((promotion.getEnseignant().getId()).longValue());
            newPromotion.setType(promotion.getEnseignant().getType());
            newPromotion.setNom(promotion.getEnseignant().getNom());
            newPromotion.setPrenom(promotion.getEnseignant().getPrenom());
        }
        return  newPromotion;
    }


    public Promotion fromPromotionDTO (PromotionDTO Promotion)
    {
        Promotion newPromotion = new Promotion();
        BeanUtils.copyProperties(Promotion,newPromotion);

        return  newPromotion;

    }
}