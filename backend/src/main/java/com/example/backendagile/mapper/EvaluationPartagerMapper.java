package com.example.backendagile.mapper;

import com.example.backendagile.dto.DroitDTO;
import com.example.backendagile.dto.EvaluationDTO;
import com.example.backendagile.dto.EvaluationPartagerDTO;
import com.example.backendagile.entities.Droit;
import org.springframework.stereotype.Service;

@Service
public class EvaluationPartagerMapper {

    private final DroitMapper droitMapper;

    public EvaluationPartagerMapper(DroitMapper droitMapper) {
        this.droitMapper = droitMapper;
    }

    public EvaluationPartagerDTO fromDroit(Droit droit){
        DroitDTO droitDTO = droitMapper.toDTO(droit);
        EvaluationDTO evaluationDTO = EvaluationMapper.toDTO(droit.getIdEvaluation());

        return new EvaluationPartagerDTO(evaluationDTO, droitDTO);
    }
}
