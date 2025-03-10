package com.example.backendagile.dto;

import com.example.backendagile.entities.Droit;
import com.example.backendagile.mapper.DroitMapper;

public class EvaluationPartagerDTO {
    private EvaluationDTO evaluation;
    private DroitDTO droit;




    public EvaluationPartagerDTO(EvaluationDTO evaluation, DroitDTO droit) {
        this.evaluation = evaluation;
        this.droit = droit;
    }

    public EvaluationDTO getEvaluation() {
        return evaluation;
    }

    public void setEvaluation(EvaluationDTO evaluation) {
        this.evaluation = evaluation;
    }

    public DroitDTO getDroit() {
        return droit;
    }

    public void setDroit(DroitDTO droit) {
        this.droit = droit;
    }



}
