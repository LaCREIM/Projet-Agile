package com.example.backendagile.repositories;

import com.example.backendagile.entities.RubriqueQuestion;
import com.example.backendagile.entities.RubriqueQuestionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RubriqueQuestionPrsRepository extends JpaRepository<RubriqueQuestion, RubriqueQuestionId> {
    @Query("SELECT rq FROM RubriqueQuestion rq " +
            "WHERE rq.idRubrique.noEnseignant.id = :noEnseignant")
    List<RubriqueQuestion> findByEnseignant(Long noEnseignant);

}
