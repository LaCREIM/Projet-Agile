package com.example.backendagile.mapper;

import com.example.backendagile.dto.QuestionDTO;
import com.example.backendagile.entities.Enseignant;
import com.example.backendagile.entities.Qualificatif;
import com.example.backendagile.entities.Question;
import com.example.backendagile.repositories.QualificatifRepository;
import com.example.backendagile.services.EnseignantService;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class QuestionMapper {
    private final QualificatifRepository qualificatifRepository;
    private final EnseignantService enseignantService;

    public QuestionMapper(QualificatifRepository qualificatifRepository, EnseignantService enseignantService) {
        this.qualificatifRepository = qualificatifRepository;
        this.enseignantService = enseignantService;
    }

    public QuestionDTO toDTO(Question question) {
        if (question == null) {
            return null;
        }

        return new QuestionDTO(
                question.getNoEnseignant() != null ? question.getNoEnseignant().getId() : null,
                question.getIntitule(),
                question.getId(),
                question.getIdQualificatif() != null ? question.getIdQualificatif().getId() : null,
                question.getIdQualificatif() != null ? question.getIdQualificatif().getMaximal() : null,
                question.getIdQualificatif() != null ? question.getIdQualificatif().getMinimal() : null,
                question.getType() // Ajout du type
        );
    }

    public Question toEntity(QuestionDTO questionDto) {
        if (questionDto == null) {
            return null;
        }

        Question question = new Question();
        question.setIntitule(questionDto.getIntitule());
        question.setType(questionDto.getType()); // Ajout du type

        // Récupérer l'enseignant depuis le service
        if (questionDto.getNoEnseignant() != null) {
            Optional<Enseignant> enseignant = enseignantService.findById(questionDto.getNoEnseignant());
            question.setNoEnseignant(enseignant.orElse(null));
        }

        // Récupération de l'entité Qualificatif depuis la base de données
        if (questionDto.getIdQualificatif() != null) {
            Optional<Qualificatif> qualificatif = qualificatifRepository.findById(questionDto.getIdQualificatif());
            question.setIdQualificatif(qualificatif.orElse(null));
        }

        return question;
    }
}