package com.example.backendagile.services;

import com.example.backendagile.dto.RubriqueQuestionPrsDTO;
import com.example.backendagile.entities.RubriqueQuestion;
import com.example.backendagile.mapper.RubriqueQuestionPrsMapper;
import com.example.backendagile.repositories.RubriqueQuestionPrsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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


}
