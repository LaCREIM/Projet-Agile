package com.example.backendagile.repositories;
import com.example.backendagile.entities.Qualificatif;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface QualificatifRepository extends JpaRepository<Qualificatif,Long> {
    Optional<Qualificatif> findById(Long id);

    @Query("SELECT q FROM Qualificatif q WHERE q.minimal = ?1 AND q.maximal = ?2")
    Qualificatif findByDesignation(String minimal , String maximal);


 // List<Qualificatif> findByMinimalContainingIgnoreCaseOrMaximalContainingIgnoreCase(String minimal, String maximal);
   @Query(value = """
        SELECT * FROM (
            SELECT q.*, ROWNUM rnum FROM (
                SELECT * FROM QUALIFICATIF 
                WHERE UPPER(MINIMAL) LIKE UPPER(:keyword) 
                   OR UPPER(MAXIMAL) LIKE UPPER(:keyword)
                ORDER BY MINIMAL
            ) q WHERE ROWNUM <= :endRow
        ) WHERE rnum > :startRow
        """, nativeQuery = true)
List<Qualificatif> searchWithPagination(
        @Param("keyword") String keyword,
        @Param("startRow") int startRow,
        @Param("endRow") int endRow);


 long countByMinimalContainingIgnoreCaseOrMaximalContainingIgnoreCase(String minimal, String maximal);


   
}
