package com.example.backendagile.mapper;

import com.example.backendagile.dto.RubriquePrsDTO;
import com.example.backendagile.entities.Enseignant;
import com.example.backendagile.entities.Rubrique;
import com.example.backendagile.services.EnseignantService;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
public class RubriquePrsMapper {

    private final EnseignantService enseignantService;

    public RubriquePrsMapper(EnseignantService enseignantService) {
        this.enseignantService = enseignantService;
    }

    // Convertir une entité Rubrique en DTO
    public  RubriquePrsDTO toDTO(Rubrique rubrique) {
        if (rubrique == null) {
            return null;
        }
        RubriquePrsDTO rbp = new RubriquePrsDTO(
                rubrique.getId(),
                rubrique.getDesignation(),
                rubrique.getOrdre(),
                null
        );
        if(rubrique.getNoEnseignant() != null) {
            rbp.setNoEnseignant(rubrique.getNoEnseignant().getId());
        }

        return rbp;
    }

    // Convertir un DTO en entité Rubrique
    public  Rubrique toEntity(RubriquePrsDTO dto) {
        Optional<Enseignant> enseignant = enseignantService.findById(Long.valueOf(dto.getNoEnseignant()));//i should get the current user *************!!!!!!!!!!!!!!!

        if (dto == null) {
            return null;
        }
        Rubrique rubrique = new Rubrique();
//        rubrique.setId(dto.getIdRubriquePrs());
        rubrique.setDesignation(dto.getDesignation());
        rubrique.setOrdre(dto.getOrdre());
        rubrique.setType("RBP");
        rubrique.setNoEnseignant(enseignant.orElse(null));
        // On ne mappe pas 'type' ni 'noEnseignant' car ils ne sont pas dans le DTO
        return rubrique;
    }
}
