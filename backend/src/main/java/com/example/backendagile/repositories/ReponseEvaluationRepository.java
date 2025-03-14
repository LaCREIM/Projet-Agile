package com.example.backendagile.repositories;

import com.example.backendagile.entities.ReponseEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReponseEvaluationRepository extends JpaRepository<ReponseEvaluation, Long> {
    List<ReponseEvaluation> findByIdEvaluation_Id(Long idEvaluation);
    boolean existsByIdEvaluation_IdAndNoEtudiant_NoEtudiant(Long idEvaluation, String idEtudiant);

    ReponseEvaluation findByIdEvaluation_IdAndNoEtudiant_NoEtudiant(Long idEvaluation, String idEtudiant);
}
