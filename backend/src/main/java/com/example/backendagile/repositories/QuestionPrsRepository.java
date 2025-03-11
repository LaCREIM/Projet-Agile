package com.example.backendagile.repositories;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backendagile.entities.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
//import java.util.Optional;

public interface QuestionPrsRepository extends JpaRepository<Question, Long> {
    @Query("SELECT q FROM Question q WHERE q.noEnseignant.id = :noEnseignant")
    List<Question> findByNoEnseignant_NoEnseignant(Long noEnseignant);

    @Query(value = """
        SELECT COUNT(*) FROM QUESTION WHERE TYPE = 'QUP' AND NO_ENSEIGNANT = :noEnseignant
        """, nativeQuery = true)
    long countByTypeForEnseignant(@Param("noEnseignant") Long noEnseignant);
    

@Query(value = """
                    SELECT * FROM (
            SELECT q.*, ROWNUM rnum 
            FROM (
                SELECT * FROM QUESTION 
                WHERE TYPE = 'QUP' AND NO_ENSEIGNANT = :noEnseignant 
                ORDER BY UPPER(INTITULE)
            ) q 
            WHERE ROWNUM <= :endRow
        ) 
        WHERE rnum > :startRow
            """, nativeQuery = true)
List<Question> findQuestionsPaged(@Param("noEnseignant") Long noEnseignant,@Param("startRow") int startRow, @Param("endRow") int endRow);
long countByType(String type);



@Query(value = """
    SELECT * FROM (
        SELECT q.*, ROWNUM rnum FROM (
            SELECT qu.*
            FROM QUESTION qu
            JOIN QUALIFICATIF qual ON qu.ID_QUALIFICATIF = qual.ID_QUALIFICATIF
            WHERE qu.TYPE = 'QUP'
            AND qu.NO_ENSEIGNANT = :noEnseignant
            AND (
                UPPER(qu.INTITULE) LIKE UPPER('%' || :keyword || '%')
                OR UPPER(qual.MINIMAL) LIKE UPPER('%' || :keyword || '%')
                OR UPPER(qual.MAXIMAL) LIKE UPPER('%' || :keyword || '%')
            )
            ORDER BY UPPER(qu.INTITULE)
        ) q WHERE ROWNUM <= :endRow
    ) WHERE rnum > :startRow
    """, nativeQuery = true)
List<Question> searchQuestionsPaged(
    @Param("noEnseignant") Long noEnseignant,
    @Param("keyword") String keyword,
    @Param("startRow") int startRow,
    @Param("endRow") int endRow
);


@Query(value = """
SELECT COUNT(*)
FROM QUESTION qu 
JOIN QUALIFICATIF qual ON qu.ID_QUALIFICATIF = qual.ID_QUALIFICATIF
WHERE qu.TYPE = 'QUP'
  AND qu.NO_ENSEIGNANT = :noEnseignant
  AND (
      UPPER(qu.INTITULE) LIKE UPPER('%' || :keyword || '%') OR
      UPPER(qual.MINIMAL) LIKE UPPER('%' || :keyword || '%') OR
      UPPER(qual.MAXIMAL) LIKE UPPER('%' || :keyword || '%')
  )
""", nativeQuery = true)
long countSearchQuestions(@Param("noEnseignant") Long noEnseignant, @Param("keyword") String keyword);

    @Query("SELECT q FROM Question q WHERE UPPER(q.intitule) = UPPER(:intitule) AND q.idQualificatif.id = :idQualificatif")
    List<Question> findQuestionByIntitule(String intitule , Long idQualificatif);

    @Query("SELECT q FROM Question q WHERE q.noEnseignant.id = :noEnseignant AND q.type = 'QUS'")
    List<Question> findQuestionStdAndPerso(Long noEnseignant);

    @Query("SELECT COUNT(qe) > 0 FROM QuestionEvaluation qe WHERE qe.idQuestion.id = :idQuestion")
    boolean existsQuestionInEvaluation(@Param("idQuestion") Long idQuestion);

}


