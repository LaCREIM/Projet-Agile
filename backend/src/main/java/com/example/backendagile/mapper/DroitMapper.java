package com.example.backendagile.mapper;

import com.example.backendagile.dto.DroitDTO;
import com.example.backendagile.entities.Droit;
import com.example.backendagile.entities.DroitId;
import com.example.backendagile.entities.Enseignant;
import com.example.backendagile.entities.Evaluation;
import com.example.backendagile.services.EnseignantService;
import com.example.backendagile.services.EvaluationService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DroitMapper {

    private final EnseignantService enseignantService;

    private final EvaluationService evaluationService;

    public DroitMapper(EnseignantService enseignantService, EvaluationService evaluationService) {
        this.enseignantService = enseignantService;
        this.evaluationService = evaluationService;
    }

    public DroitDTO toDTO(Droit droit) {
        if (droit == null) {
            return null;
        }
        char consultation = droit.getConsultation() ;
        char duplication = droit.getDuplication();
        System.out.println("Consultation : "+consultation);
        String nom = droit.getNoEnseignant().getNom();
        String prenom = droit.getNoEnseignant().getPrenom();

        DroitDTO droitDTO = new DroitDTO();

        droitDTO.setIdEvaluation(droit.getId().getIdEvaluation());
        droitDTO.setIdEnseignant((long) droit.getId().getNoEnseignant());
        droitDTO.setNom(nom);
        droitDTO.setPrenom(prenom);
        droitDTO.setConsultation(consultation);
        droitDTO.setDuplication(duplication);
        System.out.println("sa passe!!!!!!!!!!!!");
        return droitDTO;
    }

    public Droit toDroit(DroitDTO droitDTO) {
        if (droitDTO == null) {
            return null;
        }
        Droit droit = new Droit();
        Optional<Enseignant> ens = enseignantService.findById(droitDTO.getIdEnseignant());
        Optional<Evaluation> eval = evaluationService.getEvaluationById(droitDTO.getIdEvaluation());


        droit.setId(new DroitId(droitDTO.getIdEvaluation(), droitDTO.getIdEnseignant().intValue()));
        droit.setIdEvaluation(eval.orElse(null));
        droit.setNoEnseignant(ens.orElse(null));
        droit.setConsultation(Character.toUpperCase(droitDTO.getConsultation()));
        droit.setDuplication(Character.toUpperCase(droitDTO.getDuplication()));
        return droit;
    }

}
