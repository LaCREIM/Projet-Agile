package com.example.backendagile.repositories;

import com.example.backendagile.entities.Rubrique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

@Repository
public interface RubriqueStdRepository extends JpaRepository<Rubrique, Long> {
    List<Rubrique> findByType(String type);

    @Query("SELECT r FROM Rubrique r WHERE UPPER(r.designation) = UPPER(:designation)")
    List<Rubrique> findRubriqueByDesignation(String designation);

    @Query("SELECT r FROM Rubrique r WHERE LOWER(r.designation) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Rubrique> searchRubriqueWithPagination( @Param("keyword") String keyword,
    @Param("startRow") int startRow,
    @Param("endRow") int endRow);

    long countByDesignationContainingIgnoreCase(String designation);



    @Query(value = """
    SELECT * FROM (
        SELECT r.*, ROWNUM rnum FROM (
            SELECT * FROM RUBRIQUE WHERE type = 'RBS'ORDER BY DESIGNATION ASC
        ) r WHERE ROWNUM <= :endRow
    ) WHERE rnum > :startRow
""", nativeQuery = true)
    List<Rubrique> findAllWithPagination(@Param("startRow") int startRow, @Param("endRow") int endRow);

    @Query("SELECT r FROM Rubrique r WHERE r.id <> :id AND LOWER(r.designation) = LOWER(:designation)")
    List<Rubrique>findRubriqueByDesignationAndDiffrentID(Long id, String designation);

    @Query("select count(e) > 0 from RubriqueEvaluation e where e.idRubrique.id = :id")
    boolean existsRubriqueInEvaluation(Long id);
}
