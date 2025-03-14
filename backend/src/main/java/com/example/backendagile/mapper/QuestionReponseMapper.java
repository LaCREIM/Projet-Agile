package com.example.backendagile.mapper;

import org.aspectj.weaver.patterns.TypePatternQuestions.Question;
import org.springframework.stereotype.Service;

import com.example.backendagile.dto.QualificatifDTO;
import com.example.backendagile.dto.QuestionReponseDTO;
import com.example.backendagile.entities.QuestionEvaluation;
@Service
public class QuestionReponseMapper {



    public QuestionReponseDTO toDTO(QuestionEvaluation qstEval , Long positionnement) {
        QuestionReponseDTO dto = new QuestionReponseDTO();
        dto.setIdQuestion(qstEval.getIdQuestion().getId());
        dto.setPositionnement(positionnement);
        dto.setIntitule(qstEval.getIdQuestion().getIntitule());
        dto.setQualificatif(new QualificatifDTO(qstEval.getIdQualificatif().getMinimal(), qstEval.getIdQualificatif().getMaximal()));
        return dto;
    }
}
