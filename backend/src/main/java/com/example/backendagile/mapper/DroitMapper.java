package com.example.backendagile.mapper;

import com.example.backendagile.dto.DroitDTO;
import com.example.backendagile.entities.Droit;
import com.example.backendagile.entities.DroitId;
import com.example.backendagile.entities.Enseignant;
import com.example.backendagile.entities.Evaluation;
import com.example.backendagile.repositories.DroitRepository;
import com.example.backendagile.services.DroitService;
import com.example.backendagile.services.EnseignantService;
import com.example.backendagile.services.EvaluationService;
import org.springframework.stereotype.Service;

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
        char consultation = droit.getConsultation() ? 'O' : 'N';
        char duplication = droit.getDuplication() ? 'O' : 'N';
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
        Enseignant ens = enseignantService.findById(droitDTO.getIdEnseignant()).get();
        Evaluation eval = evaluationService.getEvaluationById(droitDTO.getIdEvaluation()).get();


        droit.setId(new DroitId(droitDTO.getIdEvaluation(), droitDTO.getIdEnseignant().intValue()));
        droit.setIdEvaluation(eval);
        droit.setNoEnseignant(ens);
        droit.setConsultation(droitDTO.getConsultation() == 'O');
        droit.setDuplication(droitDTO.getDuplication() == 'O');
        return droit;
    }

}
