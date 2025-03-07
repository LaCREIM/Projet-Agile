package com.example.backendagile.services;

import com.example.backendagile.dto.PromotionDTO;
import com.example.backendagile.dto.QuestionPrsDTO;
import com.example.backendagile.entities.Promotion;
import com.example.backendagile.entities.Qualificatif;
import com.example.backendagile.entities.Question;
import com.example.backendagile.mapper.QuestionPrsMapper;
import com.example.backendagile.repositories.QualificatifRepository;
import com.example.backendagile.repositories.QuestionPrsRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuestionPrsService {

    private final QuestionPrsRepository questionRepository;
    private final QualificatifRepository qualificatifRepository;

    private final QuestionPrsMapper questionMapper;
    public QuestionPrsService(QuestionPrsRepository questionRepository, QuestionPrsMapper questionMapper, QualificatifRepository qualificatifRepository) {
        this.questionRepository = questionRepository;
        this.questionMapper = questionMapper;
        this.qualificatifRepository = qualificatifRepository;
    }

    public List<QuestionPrsDTO> getAllQuestions() {
        List<Question> questions = questionRepository.findAll();

        return   questions.stream().map(pmt ->questionMapper.fromQuestion(pmt)).collect(Collectors.toList());
    }

    public Optional<QuestionPrsDTO> getQuestionById(Long id) {
        Question question = questionRepository.findById(id).orElseThrow(()->new RuntimeException("Question Not Found"));

        return Optional.of(questionMapper.fromQuestion(question));
    }

    public QuestionPrsDTO saveQuestion(QuestionPrsDTO questionPrsDTO) {

        Question question = questionMapper.fromQuestionDTO(questionPrsDTO);
        Question savedQuestion = questionRepository.save(question);
        return questionMapper.fromQuestion(savedQuestion);
    }

    public QuestionPrsDTO updateQuestion(Long id, QuestionPrsDTO questionPrsDTO) {
        Question existingQuestion = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question Not Found"));



        // Mettre à jour les propriétés existantes
        existingQuestion.setIntitule(questionPrsDTO.getIntitule());
        existingQuestion.setType("QUP");
        Optional<Qualificatif> qualificatif = qualificatifRepository.findById(questionPrsDTO.getIdQualificatif());
        existingQuestion.setIdQualificatif(qualificatif.orElse(null));
        Question updatedQuestion = questionRepository.save(existingQuestion);
        return questionMapper.fromQuestion(updatedQuestion);
    }


    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }

    public List<QuestionPrsDTO> getQuestionsByEnseignant(Long noEnseignant) {
        List<Question> questions = questionRepository.findByNoEnseignant_NoEnseignant(noEnseignant);
        return questions.stream()
                .map(questionMapper::fromQuestion)
                .collect(Collectors.toList());
    }

/* 
    public List<QuestionPrsDTO> getAllQuestionsPaged(int page, int size) {
        return questionRepository.findAllPaged(page, size)
                .stream()
                .map(questionMapper::fromQuestion)
                .collect(Collectors.toList());
    }*/

    public List<Question> searchPersonalQuestionsPaged(Long noEnseignant, String keyword, int page, int size) {
        int startRow = (page - 1) * size;
        int endRow = page * size;
        return questionRepository.searchQuestionsPaged(noEnseignant, keyword, startRow, endRow);
    }
    
    public int getSearchTotalPages(Long noEnseignant, String keyword, int size) {
        long total = questionRepository.countSearchQuestions(noEnseignant, keyword);
        return (int) Math.ceil((double) total / size);
    }
    

    public List<Question> getQuestionsPaged(Long noEnseignant,int page, int size) {
        int startRow = (page - 1) * size;
        int endRow = page * size;
        return questionRepository.findQuestionsPaged(noEnseignant,startRow, endRow);
    }
   
    public int getTotalPages(Long noEnseignant, int size) {
        long totalQuestions = questionRepository.countByTypeForEnseignant(noEnseignant);
        return (int) Math.ceil((double) totalQuestions / size);
    }

    public Optional<Question> findByIntitule(String intitule , Long idQualificatif) {
        return questionRepository.findQuestionByIntitule(intitule, idQualificatif).stream().findFirst();
    }

    public List<QuestionPrsDTO> getQuestionsStdAndPerso(Long noEnseignant) {
        List<Question> questions = questionRepository.findQuestionStdAndPerso(noEnseignant);
        return questions.stream()
                .map(questionMapper::fromQuestion)
                .collect(Collectors.toList());
    }
    public Boolean existsQuestionInEvaluation(Long idQuestion) {
        return questionRepository.existsQuestionInEvaluation(idQuestion);
    }
}
