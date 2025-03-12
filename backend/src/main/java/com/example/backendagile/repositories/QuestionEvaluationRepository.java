package com.example.backendagile.repositories;

import com.example.backendagile.entities.QuestionEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuestionEvaluationRepository extends JpaRepository<QuestionEvaluation, Long> {
    @Query("SELECT COUNT(q) > 0 FROM QuestionEvaluation q WHERE q.idQuestion.id = ?1")
    boolean existsByQuestionId(Long id);

    List<QuestionEvaluation> findQuestionEvaluationsById (Long IdRubriqueEvaluation );
}
