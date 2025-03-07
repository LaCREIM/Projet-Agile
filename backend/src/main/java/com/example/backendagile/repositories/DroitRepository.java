package com.example.backendagile.repositories;

import com.example.backendagile.entities.Droit;
import com.example.backendagile.entities.DroitId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DroitRepository extends JpaRepository<Droit, DroitId> {

    @Query("SELECT d FROM Droit d WHERE d.id.idEvaluation = :idEvaluation")
    List<Droit> findByIdEvaluation(Long idEvaluation);

    @Query("SELECT d FROM Droit d WHERE d.id.idEvaluation = :idEvaluation AND d.id.noEnseignant = :idEnseignant")
    List<Droit> findByIdEvaluationAndIdEnseignant(Long idEvaluation, Long idEnseignant);
}
