package com.example.backendagile.mapper;

import org.springframework.stereotype.Service;

import com.example.backendagile.dto.RubriqueReponseDTO;

import com.example.backendagile.entities.RubriqueEvaluation;
@Service
public class RubriqueReponseMapper {
    



        public RubriqueReponseDTO toDTO(RubriqueEvaluation rubriqueEvaluation) {

            RubriqueReponseDTO dto = new RubriqueReponseDTO();
            dto.setIdRubrique(rubriqueEvaluation.getIdRubrique().getId());
            dto.setDesignation(rubriqueEvaluation.getDesignation());
            return dto;
            }
}
