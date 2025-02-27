package com.example.backendagile.repositories;

import com.example.backendagile.entities.RubriqueQuestion;
import com.example.backendagile.entities.RubriqueQuestionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
@Repository
public interface RubriqueQuestionStdRepository extends JpaRepository<RubriqueQuestion, RubriqueQuestionId> {
    @Query("SELECT rq FROM RubriqueQuestion rq WHERE rq.idRubrique.id = ?1 ORDER BY rq.ordre ASC")
    List<RubriqueQuestion> findByIdRubriqueId(Long idRubrique);

}
