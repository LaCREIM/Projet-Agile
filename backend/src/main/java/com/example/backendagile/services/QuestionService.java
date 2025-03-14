package com.example.backendagile.services;

import com.example.backendagile.dto.QuestionDTO;
import com.example.backendagile.entities.Qualificatif;
import com.example.backendagile.entities.Question;
import com.example.backendagile.mapper.QuestionMapper;
import com.example.backendagile.repositories.QuestionRepository;
import com.example.backendagile.repositories.QualificatifRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import java.util.stream.Collectors;

@Service
@Transactional
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final QualificatifRepository qualificatifRepository;
    private final QuestionMapper questionMapper;

    public QuestionService(QuestionRepository questionRepository, QuestionMapper questionMapper, QualificatifRepository qualificatifRepository) {
        this.questionRepository = questionRepository;
        this.questionMapper = questionMapper;
        this.qualificatifRepository = qualificatifRepository;
    }

    public List<QuestionDTO> getAllQuestions() {
        List<Question> questions = questionRepository.findAll();
        return questions.stream().map(questionMapper::toDTO).collect(Collectors.toList());
    }

    public Optional<QuestionDTO> getQuestionById(Long id) {
        Question question = questionRepository.findById(id).orElseThrow(() -> new RuntimeException("Question Not Found"));
        return Optional.of(questionMapper.toDTO(question));
    }

    public QuestionDTO saveQuestion(QuestionDTO questionDTO) {
        Question question = questionMapper.toEntity(questionDTO);
        Question savedQuestion = questionRepository.save(question);
        return questionMapper.toDTO(savedQuestion);
    }

    public QuestionDTO updateQuestion(Long id, QuestionDTO questionDTO) {
        Question existingQuestion = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question Not Found"));

        existingQuestion.setIntitule(questionDTO.getIntitule());
        existingQuestion.setType(questionDTO.getType());
        Optional<Qualificatif> qualificatif = qualificatifRepository.findById(questionDTO.getIdQualificatif());
        existingQuestion.setIdQualificatif(qualificatif.orElse(null));

        Question updatedQuestion = questionRepository.save(existingQuestion);
        return questionMapper.toDTO(updatedQuestion);
    }

    public void deleteQuestion(Long id) {
        if (questionRepository.existsQuestionInEvaluation(id)) {
            throw new RuntimeException("Cannot delete question linked to an evaluation");
        }
        questionRepository.deleteById(id);
    }

    public List<QuestionDTO> getQuestionsByEnseignant(Long noEnseignant) {
        List<Question> questions = questionRepository.findByNoEnseignant(noEnseignant);
        return questions.stream().map(questionMapper::toDTO).collect(Collectors.toList());
    }

    public List<Question> searchQuestionsPaged(Long noEnseignant, String keyword, int page, int size) {
        int startRow = (page - 1) * size;
        int endRow = page * size;
        return questionRepository.searchQuestionsPaged(noEnseignant, keyword, startRow, endRow);
    }

    public int getSearchTotalPages(Long noEnseignant, String keyword, int size) {
        long total = questionRepository.countSearchQuestions(noEnseignant, keyword);
        return (int) Math.ceil((double) total / size);
    }

    public List<Question> getQuestionsPaged(Long noEnseignant, int page, int size) {
        int startRow = (page - 1) * size;
        int endRow = page * size;
        return questionRepository.findQuestionsPaged(noEnseignant, startRow, endRow);
    }

    public int getTotalPages(Long noEnseignant, int size) {
        long totalQuestions = questionRepository.countByTypeForEnseignant(noEnseignant);
        return (int) Math.ceil((double) totalQuestions / size);
    }

    public Optional<Question> findByIntitule(String intitule, Long idQualificatif) {
        return questionRepository.findQuestionByIntitule(intitule, idQualificatif).stream().findFirst();
    }

    public List<QuestionDTO> getQuestionsStdAndPerso(Long noEnseignant) {
        List<Question> questions = questionRepository.findQuestionStdAndPerso(noEnseignant);
        return questions.stream().map(questionMapper::toDTO).collect(Collectors.toList());
    }

    public Boolean existsQuestionInEvaluation(Long idQuestion) {
        return questionRepository.existsQuestionInEvaluation(idQuestion);
    }
}

