package com.example.backendagile.repositories;

import com.example.backendagile.entities.Rubrique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface RubriqueRepository extends JpaRepository<Rubrique, Long> {


    @Query(value = """
                SELECT * FROM (
                    SELECT e.*, ROWNUM rnum FROM (
                        SELECT * FROM dosi_dev.rubrique WHERE NO_ENSEIGNANT = :enseignantId ORDER BY designation ASC
                                                         ) e WHERE ROWNUM <= :endRow
                ) WHERE rnum > :startRow
            """, nativeQuery = true)
    List<Rubrique> findAllWithPagination(String enseignantId, int startRow, int endRow);
}


