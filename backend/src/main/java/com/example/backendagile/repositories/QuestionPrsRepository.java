package com.example.backendagile.repositories;
import org.springframework.data.jpa.repository.Query;


import com.example.backendagile.entities.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuestionPrsRepository extends JpaRepository<Question, Long> {
    @Query("SELECT q FROM Question q WHERE q.noEnseignant.id = :noEnseignant")
    List<Question> findByNoEnseignant_NoEnseignant(Long noEnseignant);

    @Query(value = """
                SELECT * FROM (
                    SELECT q.*, ROWNUM rnum FROM (
                        SELECT * FROM Question WHERE type = 'QUP' AND no_enseignant= :noEnseignant
                    ) q WHERE ROWNUM <= :endRow
                ) WHERE rnum > :startRow
            """, nativeQuery = true)
    Optional<Question> findAllPaged(int page, int size);
}
