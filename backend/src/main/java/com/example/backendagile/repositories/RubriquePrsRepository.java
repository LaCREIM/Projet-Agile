package com.example.backendagile.repositories;

import com.example.backendagile.entities.Rubrique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RubriquePrsRepository extends JpaRepository<Rubrique, Long> {
    @Query("SELECT r FROM Rubrique r WHERE r.noEnseignant.id = :noEnseignant")
    List<Rubrique> findByNoEnseignant_NoEnseignant(Long noEnseignant);

    @Query("SELECT r FROM Rubrique r WHERE r.noEnseignant.id = :noEnseignant  and LOWER(r.designation) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Rubrique> searchRubriqueWithPagination( @Param("keyword") String keyword,
                                                 @Param("noEnseignant") Long noEnseignant,
                                                 @Param("startRow") int startRow,
                                                 @Param("endRow") int endRow);

    long countByDesignationContainingIgnoreCase(String designation);

    @Query(value = """
    SELECT * FROM (
        SELECT r.*, ROWNUM rnum FROM (
            SELECT * FROM RUBRIQUE WHERE type = 'RBP' and NO_ENSEIGNANT= :noEnseignant ORDER BY DESIGNATION ASC
        ) r WHERE ROWNUM <= :endRow
    ) WHERE rnum > :startRow
""", nativeQuery = true)
    List<Rubrique> findAllWithPagination(@Param("noEnseignant") long noEnseignant , @Param("startRow") int startRow, @Param("endRow") int endRow);

    @Query("select r from Rubrique r where r.type = 'RBS' or r.noEnseignant.id = :noEnseignant")
    List<Rubrique> findRubriqueStdAndPerso(Long noEnseignant);

    List<Rubrique> findRubriqueByDesignation(String designation);

}
