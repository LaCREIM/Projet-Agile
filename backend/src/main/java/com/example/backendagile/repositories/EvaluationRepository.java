package com.example.backendagile.repositories;

import com.example.backendagile.entities.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    @Query("""
    SELECT e FROM Evaluation e
    JOIN FETCH e.elementConstitutif
    JOIN FETCH e.promotion
    WHERE e.noEnseignant.id = :noEnseignant
    ORDER BY e.debutReponse DESC
""")
List<Evaluation> findByNoEnseignant(@Param("noEnseignant") Long noEnseignant);

    

}
