package com.example.backendagile.services;
import com.example.backendagile.dto.PromotionDTO;
import com.example.backendagile.entities.Promotion;
import com.example.backendagile.entities.UniteEnseignement;
import com.example.backendagile.mapper.UniteEnseignementMapper;
import org.springframework.stereotype.Service;
import com.example.backendagile.repositories.UniteEnseignementRepository;
import com.example.backendagile.dto.UniteEnseignementDTO;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.apache.logging.log4j.ThreadContext.isEmpty;

@Service
public class UniteEnseignementService {

    private final UniteEnseignementRepository uniteEnseignementRepository;
    private final PromotionService promotionService;
    private final UniteEnseignementMapper uniteEnseignementMapper;

    public UniteEnseignementService(UniteEnseignementRepository uniteEnseignementRepository, PromotionService promotionService, UniteEnseignementMapper uniteEnseignementMapper) {
        this.uniteEnseignementRepository = uniteEnseignementRepository;
        this.promotionService = promotionService;
        this.uniteEnseignementMapper = uniteEnseignementMapper;
    }

    public List<UniteEnseignementDTO> getAllUnitesEnseignement() {
       return uniteEnseignementRepository.findAllUesWithCodeAndDesignation();

    }

    public List<UniteEnseignementDTO> getUnitesEnseignementByPromotion(long noEnseignant) {
        List<PromotionDTO> prms = promotionService.getPromotionsByEnseignantForEvaluation(noEnseignant);
        if(prms==null || prms.isEmpty()){
            return null;
        }
        List<UniteEnseignement> uniteEnseignements = new ArrayList<>();
        for (PromotionDTO prm : prms) {
            if(prm.getNoEnseignant()!=null && prm.getNoEnseignant()==noEnseignant){
                uniteEnseignements.addAll(uniteEnseignementRepository.findUniteEnseignementByPromotion(prm.getCodeFormation()));
            }
            else{
                uniteEnseignements.addAll(uniteEnseignementRepository.findUniteEnseignementByPromotion(noEnseignant, prm.getCodeFormation()));
            }
        }
        Set<UniteEnseignement> uniqueUniteEnseignements = new HashSet<>();
        // Extraction et insertion dans le Set pour rendre unique
        uniteEnseignements.forEach(ue -> uniqueUniteEnseignements.add(ue));


//        Set<String> uniqueCodes = new HashSet<>();
//        // Extraction et insertion dans le Set pour rendre unique
//        prms.forEach(ue -> uniqueCodes.add(ue.getCodeFormation()));
//
//        if(uniqueCodes.isEmpty()){
//            return null;
//        }
//        List<UniteEnseignement> uniteEnseignements= new ArrayList<>() ;
//
//
//        for(String codeFormation : uniqueCodes){
//            List<UniteEnseignement> ues;
//            if(prms.get(0).getNoEnseignant() == noEnseignant){
//                 ues = uniteEnseignementRepository.findUniteEnseignementByPromotion(codeFormation);
//            }
//            else {
//                 ues = uniteEnseignementRepository.findUniteEnseignementByPromotion(noEnseignant, codeFormation);
//            } if(!ues.isEmpty()){
//                uniteEnseignements.addAll(ues);
//            }
//        }

        return uniqueUniteEnseignements.stream().map(uniteEnseignementMapper::toDTO).collect(Collectors.toList());
    }


}