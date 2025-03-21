package com.example.backendagile.repositories;

import com.example.backendagile.entities.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {

    @Query("SELECT e FROM Evaluation e WHERE e.enseignant.id = :idEnseignant ORDER BY e.anneeUniversitaire")
    List<Evaluation> findByIdEnseignantEvaluationSorted(@Param("idEnseignant") Long id);

    List<Evaluation> findByEnseignant_Id(Long id);
    Optional<Evaluation> findByEnseignant_IdAndId(Long idEnseignant, Long idEvaluation);

    @Query("select e from Evaluation e where e.id = :idEvaluation")
    Evaluation findByIdEvaluation(Long idEvaluation);

    @Query("SELECT COUNT(e) > 0 FROM Evaluation e " +
                "WHERE e.anneeUniversitaire = :anneeUniversitaire " +
                "AND e.enseignant.id = :noEnseignant " +
                "AND e.noEvaluation = :noEvaluation " +
                "AND e.codeFormation = :codeFormation " +
                "AND e.codeUE = :codeUE")
    boolean existsByUniqueConstraint(String anneeUniversitaire,
                                          Long noEnseignant,
                                          Short noEvaluation,
                                          String codeFormation,
                                          String codeUE);



    @Query("""
        SELECT e FROM Evaluation e 
        WHERE e.codeFormation = :codeFormation 
        AND e.anneeUniversitaire = :anneeUniversitaire 
        AND e.etat <> 'ELA'
    """)
    List<Evaluation> findByPromotionAndEtatNotELA(
        @Param("codeFormation") String codeFormation, 
        @Param("anneeUniversitaire") String anneeUniversitaire
    );
    
    }





