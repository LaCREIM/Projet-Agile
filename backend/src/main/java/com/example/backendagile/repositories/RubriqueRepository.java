package com.example.backendagile.repositories;

import com.example.backendagile.entities.Rubrique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface RubriqueRepository extends JpaRepository<Rubrique, Long> {


    @Query(value = """
    SELECT * FROM (
        SELECT e.*, ROWNUM rnum FROM (
            SELECT * FROM RUBRIQUE 
            WHERE NO_ENSEIGNANT = :enseignantId OR 
                  type='RBS' 
            ORDER BY DESIGNATION ASC
        ) e WHERE ROWNUM <= :endRow
    ) WHERE rnum > :startRow
""", nativeQuery = true)
    List<Rubrique> findAllWithPagination(
            @Param("enseignantId") long enseignantId,
            @Param("startRow") int startRow,
            @Param("endRow") int endRow
    );


    // 🔹 Rechercher une rubrique par sa désignation (JPQL)
    @Query("SELECT r FROM Rubrique r WHERE r.designation = :designation")
    Optional<Rubrique> findByDesignation(@Param("designation") String designation);

    @Query("SELECT r.designation FROM Rubrique r WHERE r.id = :id")
    String findDesignation(Long id);
}


