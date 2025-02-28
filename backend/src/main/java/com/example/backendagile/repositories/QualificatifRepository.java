package com.example.backendagile.repositories;
import com.example.backendagile.entities.Qualificatif;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QualificatifRepository extends JpaRepository<Qualificatif,Long> {
    Optional<Qualificatif> findById(Long id);

    @Query("SELECT q FROM Qualificatif q WHERE q.minimal = ?1 AND q.maximal = ?2")
    Qualificatif findByDesignation(String minimal , String maximal);
}
