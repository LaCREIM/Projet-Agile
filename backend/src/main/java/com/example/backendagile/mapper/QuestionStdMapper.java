package com.example.backendagile.mapper;

import com.example.backendagile.dto.QuestionStdDTO;
import com.example.backendagile.entities.Question;
import com.example.backendagile.entities.Qualificatif;
import org.springframework.stereotype.Component;

@Component
public class QuestionStdMapper {

    public QuestionStdDTO toDto(Question question) {
        QuestionStdDTO dto = new QuestionStdDTO();
        dto.setIdQualificatif(question.getIdQualificatif().getId());
        dto.setIntitule(question.getIntitule());

        Qualificatif qualificatif = question.getIdQualificatif();
        if (qualificatif != null) {
            dto.setMaxQualificatif(qualificatif.getMaximal());
            dto.setMinQualificatif(qualificatif.getMinimal());
        }

        return dto;
    }

    public Question toEntity(QuestionStdDTO dto, Qualificatif qualificatif) {
        Question question = new Question();
        question.setType("QUS");
        question.setIdQualificatif(qualificatif);
        question.setIntitule(dto.getIntitule());
        question.setNoEnseignant(null); 
        return question;
    }
}
