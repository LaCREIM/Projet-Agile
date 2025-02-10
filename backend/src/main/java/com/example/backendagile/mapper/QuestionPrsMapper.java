package com.example.backendagile.mapper;

import com.example.backendagile.dto.QuestionPrsDTO;
import com.example.backendagile.entities.Enseignant;
import com.example.backendagile.entities.Qualificatif;
import com.example.backendagile.entities.Question;
import com.example.backendagile.repositories.EnseignantRepository;
import com.example.backendagile.repositories.QualificatifRepository;
import com.example.backendagile.services.EnseignantService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
public class QuestionPrsMapper {
    private final QualificatifRepository qualificatifRepository;
    private final EnseignantService enseignantService;

    public QuestionPrsMapper(QualificatifRepository qualificatifRepository, EnseignantService enseignantService) {
        this.qualificatifRepository = qualificatifRepository;
        this.enseignantService = enseignantService;
    }


    public QuestionPrsDTO fromQuestion(Question question) {
        if (question == null) {
            return null;
        }

        QuestionPrsDTO questionDto = new QuestionPrsDTO();
        questionDto.setIntitule(question.getIntitule());
        questionDto.setIdQuestion(question.getId());
        if (question.getIdQualificatif() != null) {
            questionDto.setIdQualificatif(question.getIdQualificatif().getId());
        }

        return questionDto;
    }

    public Question fromQuestionDTO(QuestionPrsDTO questionDto) {
        if (questionDto == null) {
            return null;
        }

        Question question = new Question();

        Optional<Enseignant> enseignant = enseignantService.findById(Long.valueOf(10));//i should get the current user *************!!!!!!!!!!!!!!!
        question.setIntitule(questionDto.getIntitule());
        question.setType("QUP");
        question.setNoEnseignant(enseignant.orElse(null));

        // Récupération de l'entité Qualificatif depuis la base de données
        if (questionDto.getIdQualificatif() != null) {
            Optional<Qualificatif> qualificatif = qualificatifRepository.findById(questionDto.getIdQualificatif());
            question.setIdQualificatif(qualificatif.orElse(null));
        }

        return question;
    }
}
