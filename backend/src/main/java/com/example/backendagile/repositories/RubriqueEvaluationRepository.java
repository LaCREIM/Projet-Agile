package com.example.backendagile.repositories;

import com.example.backendagile.entities.RubriqueEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RubriqueEvaluationRepository extends JpaRepository<RubriqueEvaluation, Long> {
    @Query("SELECT r FROM RubriqueEvaluation r WHERE r.idEvaluation.id = :id")
    List<RubriqueEvaluation> findAllByIdEvaluation(Long id);
}
