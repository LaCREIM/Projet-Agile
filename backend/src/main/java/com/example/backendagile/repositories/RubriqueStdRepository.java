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

    List<Rubrique> findRubriqueByDesignation(String designation);

    @Query("SELECT r FROM Rubrique r WHERE LOWER(r.designation) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Rubrique> searchRubriqueWithPagination( @Param("keyword") String keyword,
    @Param("startRow") int startRow,
    @Param("endRow") int endRow);

    long countByDesignationContainingIgnoreCase(String designation);
}
