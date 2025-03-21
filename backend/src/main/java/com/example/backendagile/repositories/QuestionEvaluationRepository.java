package com.example.backendagile.repositories;

import com.example.backendagile.entities.QuestionEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuestionEvaluationRepository extends JpaRepository<QuestionEvaluation, Long> {
    @Query("SELECT COUNT(q) > 0 FROM QuestionEvaluation q WHERE q.idQuestion.id = ?1")
    boolean existsByQuestionId(Long id);

    @Query("SELECT q FROM QuestionEvaluation q WHERE q.idRubriqueEvaluation.id = ?1")
    List<QuestionEvaluation> findQuestionEvaluationsById (Long IdRubriqueEvaluation );

    @Query("SELECT q FROM QuestionEvaluation q WHERE q.idRubriqueEvaluation.id = ?1 AND q.idQuestion.id = ?2")
    QuestionEvaluation findQuestionEvaluationByIdRubriqueEvaluationAndIdQuestion(Long idRubriqueEvaluation, Long idQuestion);
    
}
