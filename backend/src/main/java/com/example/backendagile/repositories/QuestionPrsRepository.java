package com.example.backendagile.repositories;
import org.springframework.data.jpa.repository.Query;


import com.example.backendagile.entities.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionPrsRepository extends JpaRepository<Question, Long> {
    @Query("SELECT q FROM Question q WHERE q.noEnseignant.id = :noEnseignant")
    List<Question> findByNoEnseignant_NoEnseignant(Long noEnseignant);
}
