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

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long>, PagingAndSortingRepository<Question, Long> {

    @Query("SELECT q FROM Question q WHERE q.type = 'QUS' ORDER BY q.intitule ASC")
    List<Question> findStandardQuestions();


@Query(value = """
            SELECT * FROM (
                SELECT q.*, ROWNUM rnum FROM (
                    SELECT * FROM QUESTION WHERE TYPE = 'QUS' ORDER BY INTITULE
                ) q WHERE ROWNUM <= :endRow
            ) WHERE rnum > :startRow
            """, nativeQuery = true)
List<Question> findQuestionsPaged(@Param("startRow") int startRow, @Param("endRow") int endRow);

long countByType(String type);

    @Query("SELECT COUNT(q) > 0 FROM Question q WHERE q.idQualificatif.id = :idQualificatif")
    Boolean existsByQualificatifId(@Param("idQualificatif") Long idQualificatif);

    @Query("SELECT q FROM Question q WHERE q.intitule = :intitule")
    List<Question> findQuestionByIntitule(String intitule);
    

    @Query(value = """
        SELECT * FROM (
            SELECT q.*, ROWNUM rnum FROM (
                SELECT qu.* 
                FROM QUESTION qu 
                JOIN QUALIFICATIF qual ON qu.ID_QUALIFICATIF = qual.ID_QUALIFICATIF
                WHERE qu.TYPE = 'QUS'
                  AND (
                      UPPER(qu.INTITULE) LIKE UPPER('%' || :keyword || '%') OR
                      UPPER(qual.MINIMAL) LIKE UPPER('%' || :keyword || '%') OR
                      UPPER(qual.MAXIMAL) LIKE UPPER('%' || :keyword || '%')
                  )
                ORDER BY qu.INTITULE
            ) q WHERE ROWNUM <= :endRow
        ) WHERE rnum > :startRow
        """, nativeQuery = true)
    List<Question> searchQuestionsPaged(
        @Param("keyword") String keyword,
        @Param("startRow") int startRow,
        @Param("endRow") int endRow
    );
    

@Query(value = """
    SELECT COUNT(*)
    FROM QUESTION qu 
    JOIN QUALIFICATIF qual ON qu.ID_QUALIFICATIF = qual.ID_QUALIFICATIF
    WHERE qu.TYPE = 'QUS'
      AND (
          UPPER(qu.INTITULE) LIKE UPPER('%' || :keyword || '%') OR
          UPPER(qual.MINIMAL) LIKE UPPER('%' || :keyword || '%') OR
          UPPER(qual.MAXIMAL) LIKE UPPER('%' || :keyword || '%')
      )
    """, nativeQuery = true)
long countSearchQuestions(@Param("keyword") String keyword);

    
}
