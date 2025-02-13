package com.example.backendagile.services;

import com.example.backendagile.dto.RubriqueQuestionStdDTO;
import com.example.backendagile.entities.RubriqueQuestion;
import com.example.backendagile.entities.RubriqueQuestionId;
import com.example.backendagile.mapper.RubriqueQuestionStdMapper;
import com.example.backendagile.repositories.RubriqueQuestionStdRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RubriqueQuestionStdService {

    private final RubriqueQuestionStdRepository rubriqueQuestionStdRepository;
    private final RubriqueQuestionStdMapper rubriqueQuestionStdMapper;

    public RubriqueQuestionStdService(RubriqueQuestionStdRepository rubriqueQuestionStdRepository, RubriqueQuestionStdMapper rubriqueQuestionStdMapper) {
        this.rubriqueQuestionStdRepository = rubriqueQuestionStdRepository;
        this.rubriqueQuestionStdMapper = rubriqueQuestionStdMapper;
    }
    public List<RubriqueQuestionStdDTO> getQuestionsByRubrique(Long idRubrique) {
        List<RubriqueQuestion> rubriqueQuestions = rubriqueQuestionStdRepository.findByIdRubriqueId(idRubrique);
        
        return rubriqueQuestions.stream()
                .map(rubriqueQuestionStdMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public List<RubriqueQuestionStdDTO> getAllRubriquesQuestionStd() {
        return rubriqueQuestionStdRepository.findAll()
                .stream()
                .map(rubriqueQuestionStdMapper::toDTO)
                .collect(Collectors.toList());
    }

    public void saveOrUpdateRubriqueQuestions(List<RubriqueQuestionStdDTO> rubriqueQuestionDtos) {
        for (RubriqueQuestionStdDTO dto : rubriqueQuestionDtos) {
            Optional<RubriqueQuestion> existingEntity = rubriqueQuestionStdRepository.findById(
                    new RubriqueQuestionId(dto.getIdRubrique(), dto.getIdQuestion())
            );
            RubriqueQuestion entity = rubriqueQuestionStdMapper.toEntity(dto, existingEntity);
            rubriqueQuestionStdRepository.save(entity);
        }
    }
    public void deleteRubriqueQuestion(Long idRubrique, Long idQuestion) {
        RubriqueQuestionId id = new RubriqueQuestionId(idRubrique, idQuestion);
        if (!rubriqueQuestionStdRepository.existsById(id)) {
            throw new IllegalArgumentException("La question standard spécifiée n'existe pas dans cette rubrique.");
        }
        rubriqueQuestionStdRepository.deleteById(id);
    }
    
}
