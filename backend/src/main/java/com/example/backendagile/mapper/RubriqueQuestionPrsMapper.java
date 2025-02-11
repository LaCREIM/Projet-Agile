package com.example.backendagile.mapper;

import com.example.backendagile.dto.QuestionPrsDTO;
import com.example.backendagile.dto.RubriqueQuestionPrsDTO;
import com.example.backendagile.entities.Question;
import com.example.backendagile.entities.Rubrique;
import com.example.backendagile.entities.RubriqueQuestion;
import com.example.backendagile.repositories.QuestionPrsRepository;
import com.example.backendagile.repositories.RubriquePrsRepository;
import com.example.backendagile.services.QuestionPrsService;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Service
public class RubriqueQuestionPrsMapper {
    
    private final RubriquePrsRepository rubriquePrsRepository;
    private final QuestionPrsRepository questionPrsRepository;
    private final QuestionPrsService questionPrsService;
    public RubriqueQuestionPrsMapper(RubriquePrsRepository rubriquePrsRepository, QuestionPrsRepository questionPrsRepository, QuestionPrsService questionPrsService) {
        this.rubriquePrsRepository = rubriquePrsRepository;
        this.questionPrsRepository = questionPrsRepository;
        this.questionPrsService = questionPrsService;
    }

    // Convertir une entité en DTO
    public RubriqueQuestionPrsDTO toDTO(RubriqueQuestion entity) {
        if (entity == null) {
            return null;
        }
        QuestionPrsDTO questionPrsDTO = questionPrsService.getQuestionById(entity.getIdQuestion().getId()).orElse(null);
        return new RubriqueQuestionPrsDTO(
                entity.getIdRubrique().getId(),
                entity.getIdRubrique().getDesignation(),
                questionPrsDTO,
                entity.getOrdre()
        );
    }

    // Convertir un DTO en entité (si nécessaire)
    public RubriqueQuestion toEntity(RubriqueQuestionPrsDTO dto) {
        if (dto == null) {
            return null;
        }

        RubriqueQuestion entity = new RubriqueQuestion();

        Rubrique rubrique = rubriquePrsRepository.findById(dto.getIdRubrique()).orElse(null);
        Question question = questionPrsRepository.findById(dto.getQuestionPrsDTO().getIdQuestion()).orElse(null);
        entity.setIdRubrique(rubrique);
        entity.setIdQuestion(question);
        entity.setOrdre(dto.getOrdre());

        return entity;
    }
}
