package com.example.backendagile.mapper;

import com.example.backendagile.dto.QuestionStdDTO;
import com.example.backendagile.dto.RubriqueQuestionStdDTO;
import com.example.backendagile.entities.Question;
import com.example.backendagile.entities.Rubrique;
import com.example.backendagile.entities.RubriqueQuestion;
import com.example.backendagile.entities.RubriqueQuestionId;
import com.example.backendagile.repositories.QuestionRepository;
import com.example.backendagile.repositories.RubriqueStdRepository;
import com.example.backendagile.services.QuestionStdService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RubriqueQuestionStdMapper {

    private final RubriqueStdRepository rubriqueStdRepository;
    private final QuestionRepository questionStdRepository;
    private final QuestionStdService questionStdService;

    public RubriqueQuestionStdMapper(RubriqueStdRepository rubriqueStdRepository, QuestionRepository questionStdRepository, QuestionStdService questionStdService) {
        this.rubriqueStdRepository = rubriqueStdRepository;
        this.questionStdRepository = questionStdRepository;
        this.questionStdService = questionStdService;
    }

    // Convertir une entité en DTO
    public RubriqueQuestionStdDTO toDTO(RubriqueQuestion entity) {
        if (entity == null) {
            return null;
        }
        QuestionStdDTO questionStdDTO = questionStdService.getQuestionById(entity.getIdQuestion().getId()).orElse(null);
        return new RubriqueQuestionStdDTO(
                entity.getIdRubrique().getId(),
                entity.getIdRubrique().getDesignation(),
                entity.getIdQuestion().getId(), // Utilisation de idQuestion directement
                questionStdDTO,
                entity.getOrdre()
        );
    }

    // Convertir un DTO en entité (si nécessaire)
    public RubriqueQuestion toEntity(RubriqueQuestionStdDTO dto, Optional<RubriqueQuestion> rubriqueQuestion) {
        if (dto == null) {
            return null;
        }
        RubriqueQuestion entity = rubriqueQuestion.orElse(new RubriqueQuestion());

        RubriqueQuestionId id = new RubriqueQuestionId(dto.getIdRubrique(), dto.getIdQuestion());

        Rubrique rubrique = rubriqueStdRepository.findById(dto.getIdRubrique()).orElse(null);
        Question question = questionStdRepository.findById(dto.getIdQuestion()).orElse(null);
        entity.setId(id);
        entity.setIdRubrique(rubrique);
        entity.setIdQuestion(question);
        entity.setOrdre(dto.getOrdre());

        return entity;
    }
}
