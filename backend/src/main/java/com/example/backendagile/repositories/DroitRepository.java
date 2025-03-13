package com.example.backendagile.repositories;

import com.example.backendagile.entities.Droit;
import com.example.backendagile.entities.DroitId;
import com.example.backendagile.entities.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface DroitRepository extends JpaRepository<Droit, DroitId> {

    @Query("SELECT d FROM Droit d WHERE d.id.idEvaluation = :idEvaluation")
    List<Droit> findByIdEvaluation(Long idEvaluation);

    @Query("SELECT d FROM Droit d WHERE d.id.idEvaluation = :idEvaluation AND d.id.noEnseignant = :idEnseignant")
    List<Droit> findByIdEvaluationAndIdEnseignant(Long idEvaluation, Long idEnseignant);

    @Query("SELECT d FROM Droit d WHERE d.id.noEnseignant = :id")
    List<Droit> findByEnseignant_Id(Long id);

    @Modifying
    @Transactional
    @Query("DELETE FROM Droit d WHERE d.idEvaluation.id = :id")
    void deleteDroitsByIdEvaluation_Id(@Param("id") Long id);
}
