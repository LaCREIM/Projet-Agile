package com.example.backendagile.mapper;

import com.example.backendagile.dto.RubriqueStdDTO;
import com.example.backendagile.entities.Rubrique;
import org.springframework.stereotype.Component;

@Component
public class RubriqueStdMapper {

    public Rubrique toEntity(RubriqueStdDTO dto) {
        Rubrique rubrique = new Rubrique();
        rubrique.setType("RBS"); 
        rubrique.setDesignation(dto.getDesignation());
        rubrique.setOrdre(null);
        rubrique.setNoEnseignant(null); 
        return rubrique;
    }
}
