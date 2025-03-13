package com.example.backendagile.mapper;

import com.example.backendagile.dto.RubriqueDTO;
import com.example.backendagile.entities.Enseignant;
import com.example.backendagile.entities.Rubrique;
import com.example.backendagile.services.EnseignantService;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
public class RubriqueMapper {

    private final EnseignantService enseignantService;

    public RubriqueMapper(EnseignantService enseignantService) {
        this.enseignantService = enseignantService;
    }

    // Convertir une entité Rubrique en DTO
    public RubriqueDTO toDTO(Rubrique rubrique) {
        if (rubrique == null) {
            return null;
        }
        return new RubriqueDTO(
                rubrique.getId(),
                rubrique.getDesignation(),
                rubrique.getOrdre(),
                rubrique.getNoEnseignant() != null ? rubrique.getNoEnseignant().getId() : null,
                rubrique.getType()
        );
    }

    // Convertir un DTO en entité Rubrique
    public Rubrique toEntity(RubriqueDTO dto) {
        if (dto == null) {
            return null;
        }

        Optional<Enseignant> enseignant = dto.getNoEnseignant() != null
                ? enseignantService.findById(dto.getNoEnseignant())
                : Optional.empty();

        Rubrique rubrique = new Rubrique();
        rubrique.setDesignation(dto.getDesignation());
        rubrique.setOrdre(dto.getOrdre());
        rubrique.setType(dto.getType());
        rubrique.setNoEnseignant(enseignant.orElse(null));

        return rubrique;
    }
}

