package com.example.backendagile.mapper;

import com.example.backendagile.dto.UniteEnseignementDTO;
import com.example.backendagile.entities.UniteEnseignement;
import org.springframework.stereotype.Service;

@Service
public class UniteEnseignementMapper {


    public UniteEnseignementDTO toDTO(UniteEnseignement uniteEnseignement) {
        return new UniteEnseignementDTO(uniteEnseignement.getId().getCodeUe(), uniteEnseignement.getDesignation(), uniteEnseignement.getId().getCodeFormation());
    }
}
