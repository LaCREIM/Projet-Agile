package com.example.backendagile.services;

import com.example.backendagile.dto.QuestionStdDTO;
import com.example.backendagile.entities.Question;
import com.example.backendagile.entities.Qualificatif;
import com.example.backendagile.mapper.QuestionStdMapper;
import com.example.backendagile.repositories.QuestionRepository;
import com.example.backendagile.repositories.QualificatifRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionStdService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QualificatifRepository qualificatifRepository;

    @Autowired
    private QuestionStdMapper questionStdMapper;

    /**
     * Récupérer toutes les questions standards
     */
    public List<Question> getStandardQuestions() {
        return questionRepository.findStandardQuestions();
    }

    /**
     * Récupérer une question standard par ID
     */
    public Optional<Question> findById(Long id) {
        return questionRepository.findById(id);
    }

    /**
     * Créer une nouvelle question standard avec un qualificatif existant
     */
    public QuestionStdDTO createStandardQuestion(QuestionStdDTO questionStdDTO) {
        Optional<Qualificatif> qualificatifOpt = qualificatifRepository.findById(questionStdDTO.getIdQualificatif());
        
        if (qualificatifOpt.isEmpty()) {
            throw new IllegalArgumentException("Le qualificatif spécifié n'existe pas.");
        }
    
        // Vérifie si max/min sont bien renseignés
        Qualificatif qualificatif = qualificatifOpt.get();
        if (qualificatif.getMaximal() == null || qualificatif.getMinimal() == null) {
            throw new IllegalArgumentException("Les qualificatifs max/min ne sont pas définis dans l'entité.");
        }
    
        Question question = questionStdMapper.toEntity(questionStdDTO, qualificatif);
        Question savedQuestion = questionRepository.save(question);
    
        return questionStdMapper.toDto(savedQuestion);
    }
    

    /**
     * Mettre à jour une question standard existante
     */
    public Question updateStandardQuestion(Long id, QuestionStdDTO questionDto) {
        Optional<Question> existingQuestionOpt = questionRepository.findById(id);
        if (existingQuestionOpt.isEmpty()) {
            throw new IllegalArgumentException("Aucune question trouvée avec cet ID.");
        }
    
        Optional<Qualificatif> qualificatifOpt = qualificatifRepository.findById(questionDto.getIdQualificatif());
        if (qualificatifOpt.isEmpty()) {
            throw new IllegalArgumentException("Le qualificatif spécifié n'existe pas.");
        }
    
        Question question = existingQuestionOpt.get();
        question.setIdQualificatif(qualificatifOpt.get());
        question.setIntitule(questionDto.getIntitule());
    
        return questionRepository.save(question);
    }
    


    /**
     * Supprimer une question standard par ID
     */
    public void deleteById(Long id) {
        questionRepository.deleteById(id);
    }
}
