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
}
