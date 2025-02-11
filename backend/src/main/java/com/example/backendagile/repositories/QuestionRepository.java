package com.example.backendagile.repositories;

import com.example.backendagile.entities.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    @Query("SELECT q FROM Question q WHERE q.type = 'QUS' AND q.noEnseignant IS NULL")
    List<Question> findStandardQuestions();
}
