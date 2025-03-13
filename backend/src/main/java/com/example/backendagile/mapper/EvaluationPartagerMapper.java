package com.example.backendagile.mapper;

import com.example.backendagile.dto.DroitDTO;
import com.example.backendagile.dto.EvaluationDTO;
import com.example.backendagile.dto.EvaluationPartagerDTO;
import com.example.backendagile.entities.Droit;
import com.example.backendagile.repositories.FormationRepository;
import com.example.backendagile.repositories.UniteEnseignementRepository;
import org.springframework.stereotype.Service;

@Service
public class EvaluationPartagerMapper {

    private final DroitMapper droitMapper;
    private final UniteEnseignementRepository uniteEnseignementRepository;
    private final FormationRepository formationRepository;

    public EvaluationPartagerMapper(DroitMapper droitMapper, UniteEnseignementRepository uniteEnseignementRepository, FormationRepository formationRepository) {
        this.droitMapper = droitMapper;
        this.uniteEnseignementRepository = uniteEnseignementRepository;
        this.formationRepository = formationRepository;
    }

    public EvaluationPartagerDTO fromDroit(Droit droit){
        DroitDTO droitDTO = droitMapper.toDTO(droit);
        EvaluationDTO evaluationDTO = EvaluationMapper.toDTO(droit.getIdEvaluation(),uniteEnseignementRepository);

        //cette partie est une copie de service evaluation methode : getEvaluationDTO
        formationRepository.findById(evaluationDTO.getCodeFormation()).ifPresent(formation -> {
            evaluationDTO.setNomFormation(formation.getNomFormation());
        });


        return new EvaluationPartagerDTO(evaluationDTO, droitDTO);
    }

    public EvaluationPartagerDTO fromEvaluationDTO(EvaluationDTO evaluationDTO){
        return new EvaluationPartagerDTO(evaluationDTO, null);
    }
}
