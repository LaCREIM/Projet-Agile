package com.example.backendagile.repositories;

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
    @Query("SELECT q FROM Question q WHERE q.type = 'QUS' AND q.noEnseignant IS NULL")
    List<Question> findStandardQuestions();

    @Query(value = """
                SELECT * FROM (
                    SELECT q.*, ROWNUM rnum FROM (
                        SELECT * FROM question WHERE type = 'QUS' AND no_enseignant IS NULL
                    ) q WHERE ROWNUM <= :endRow
                ) WHERE rnum > :startRow
            """, nativeQuery = true)
    List<Question> findAllWithPagination(@Param("startRow") int startRow, @Param("endRow") int endRow);
}
