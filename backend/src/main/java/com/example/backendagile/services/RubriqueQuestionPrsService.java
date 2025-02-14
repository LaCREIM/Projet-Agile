package com.example.backendagile.services;

import com.example.backendagile.dto.RubriqueQuestionPrsDTO;
import com.example.backendagile.entities.RubriqueQuestion;
import com.example.backendagile.entities.RubriqueQuestionId;
import com.example.backendagile.mapper.RubriqueQuestionPrsMapper;
import com.example.backendagile.repositories.RubriqueQuestionPrsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class RubriqueQuestionPrsService {

    private final RubriqueQuestionPrsRepository rubriqueQuestionRepository;
    private final RubriqueQuestionPrsMapper rubriqueQuestionPrsMapper;

    public RubriqueQuestionPrsService(RubriqueQuestionPrsRepository rubriqueQuestionRepository, RubriqueQuestionPrsMapper rubriqueQuestionPrsMapper) {
        this.rubriqueQuestionRepository = rubriqueQuestionRepository;
        this.rubriqueQuestionPrsMapper = rubriqueQuestionPrsMapper;
    }

    // Récupérer les rubriques des questions associées à un enseignant donné
    public List<RubriqueQuestionPrsDTO> getRubriquesQuestionByEnseignant(Long noEnseignant) {
    List<RubriqueQuestion> rubriques = rubriqueQuestionRepository.findByEnseignant(noEnseignant);
    List<RubriqueQuestionPrsDTO> rubriquesDTO = rubriques.stream()
            .map(rubriqueQuestionPrsMapper::toDTO)
            .collect(Collectors.toList());
    return rubriquesDTO;
    }

    public void saveOrUpdateRubriqueQuestions(List<RubriqueQuestionPrsDTO> rubriqueQuestionDtos) {
        for (RubriqueQuestionPrsDTO dto : rubriqueQuestionDtos) {
            // Vérifier si l'enregistrement existe déjà en utilisant l'ID composite
            RubriqueQuestionId id = new RubriqueQuestionId(dto.getIdRubrique(), dto.getQuestionPrsDTO().getIdQuestion());
            RubriqueQuestion rubriqueQuestion = rubriqueQuestionRepository.findById(id).orElse(new RubriqueQuestion());

            rubriqueQuestion = rubriqueQuestionPrsMapper.toEntity(dto, Optional.of(rubriqueQuestion));

            // Sauvegarder ou mettre à jour l'enregistrement
            rubriqueQuestionRepository.save(rubriqueQuestion);
        }
    }
    public void deleteRubriqueQuestion(Long idRubrique, Long idQuestion) {
        RubriqueQuestionId id = new RubriqueQuestionId(idRubrique, idQuestion);
        if (!rubriqueQuestionRepository.existsById(id)) {
            throw new IllegalArgumentException("La question personnelle spécifiée n'existe pas dans cette rubrique.");
        }
        rubriqueQuestionRepository.deleteById(id);
    }

    public List<RubriqueQuestionPrsDTO> getQuestionsByRubrique(Long idRubrique) {
        List<RubriqueQuestion> rubriqueQuestions = rubriqueQuestionRepository.findByIdRubriqueId(idRubrique);

        return rubriqueQuestions.stream()
                .map(rubriqueQuestionPrsMapper::toDTO)
                .collect(Collectors.toList());
    }



}
