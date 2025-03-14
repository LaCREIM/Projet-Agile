package com.example.backendagile.repositories;

import com.example.backendagile.entities.Qualificatif;
import com.example.backendagile.entities.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long>, PagingAndSortingRepository<Question, Long> {

    @Query("SELECT q FROM Question q ORDER BY UPPER(q.intitule) ASC")
    List<Question> findStandardQuestions();

    @Query("SELECT q FROM Question q WHERE q.noEnseignant.id = :noEnseignant")
    List<Question> findByNoEnseignant_NoEnseignant(Long noEnseignant);

    @Query(value = """
        SELECT COUNT(*) FROM QUESTION WHERE TYPE = 'QUP' AND NO_ENSEIGNANT = :noEnseignant
        """, nativeQuery = true)
    long countByTypeForEnseignant(@Param("noEnseignant") Long noEnseignant);

    @Query(value = """
        SELECT * FROM (
            SELECT q.*, ROWNUM rnum FROM (
                SELECT * FROM QUESTION 
                WHERE TYPE = 'QUS' AND NO_ENSEIGNANT = :noEnseignant 
                ORDER BY UPPER(INTITULE)
            ) q WHERE ROWNUM <= :endRow
        ) WHERE rnum > :startRow
        """, nativeQuery = true)
    List<Question> findQuestionsPaged(
            @Param("noEnseignant") Long noEnseignant,
            @Param("startRow") int startRow,
            @Param("endRow") int endRow
    );

    long countByType(String type);

    @Query("SELECT COUNT(q) > 0 FROM Question q WHERE q.idQualificatif.id = :idQualificatif")
    Boolean existsByQualificatifId(@Param("idQualificatif") Long idQualificatif);

    @Query("SELECT q FROM Question q WHERE UPPER(q.intitule) = UPPER(:intitule) AND q.idQualificatif.id = :idQualificatif")
    List<Question> findQuestionByIntitule(String intitule, Long idQualificatif);

    @Query(value = """
        SELECT * FROM (
            SELECT q.*, ROWNUM rnum FROM (
                SELECT qu.* 
                FROM QUESTION qu 
                JOIN QUALIFICATIF qual ON qu.ID_QUALIFICATIF = qual.ID_QUALIFICATIF
                WHERE qu.TYPE = 'QUS'
                  AND qu.NO_ENSEIGNANT = :noEnseignant
                  AND (
                      UPPER(qu.INTITULE) LIKE UPPER('%' || :keyword || '%') OR
                      UPPER(qual.MINIMAL) LIKE UPPER('%' || :keyword || '%') OR
                      UPPER(qual.MAXIMAL) LIKE UPPER('%' || :keyword || '%')
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
        WHERE qu.TYPE = 'QUS'
          AND qu.NO_ENSEIGNANT = :noEnseignant
          AND (
              UPPER(qu.INTITULE) LIKE UPPER('%' || :keyword || '%') OR
              UPPER(qual.MINIMAL) LIKE UPPER('%' || :keyword || '%') OR
              UPPER(qual.MAXIMAL) LIKE UPPER('%' || :keyword || '%')
          )
        """, nativeQuery = true)
    long countSearchQuestions(@Param("noEnseignant") Long noEnseignant, @Param("keyword") String keyword);

    @Query("SELECT COUNT(qe) > 0 FROM QuestionEvaluation qe WHERE qe.idQuestion.id = :idQuestion")
    boolean existsQuestionInEvaluation(@Param("idQuestion") Long idQuestion);


    @Query("SELECT q FROM Question q WHERE q.noEnseignant.id = :noEnseignant")
    List<Question> findByNoEnseignant(@Param("noEnseignant") Long noEnseignant);

    @Query("SELECT q FROM Question q WHERE q.noEnseignant.id = :noEnseignant OR q.type = 'QUS'")
    List<Question> findQuestionStdAndPerso(@Param("noEnseignant") Long noEnseignant);


    @Query("SELECT q FROM Question q WHERE UPPER(q.intitule) = UPPER(:intitule) AND q.idQualificatif.id = :idQualificatif")
    Optional<Question> findByIntitule(@Param("intitule") String intitule, @Param("idQualificatif") Long idQualificatif);


    @Query(value = """
    SELECT * FROM (
        SELECT q.*, ROWNUM rnum FROM (
            SELECT * FROM QUESTION 
            WHERE UPPER(INTITULE) LIKE UPPER('%' || :keyword || '%') 
            ORDER BY UPPER(INTITULE)
        ) q WHERE ROWNUM <= :endRow
    ) WHERE rnum > :startRow
    """, nativeQuery = true)
    List<Question> searchQuestionsPaged(
            @Param("keyword") String keyword,
            @Param("startRow") int startRow,
            @Param("endRow") int endRow
    );

    @Query(value = """
    SELECT * FROM (
        SELECT q.*, ROWNUM rnum FROM (
            SELECT * FROM QUESTION
            ORDER BY UPPER(INTITULE)
        ) q WHERE ROWNUM <= :endRow
    ) WHERE rnum > :startRow
    """, nativeQuery = true)
    List<Question> findQuestionsPaged(
            @Param("startRow") int startRow,
            @Param("endRow") int endRow
    );

    @Query(value = """
    SELECT COUNT(*)
    FROM QUESTION
    WHERE UPPER(INTITULE) LIKE UPPER('%' || :keyword || '%')
    """, nativeQuery = true)
    long countSearchQuestions(@Param("keyword") String keyword);

}
