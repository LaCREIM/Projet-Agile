package com.example.backendagile.repositories;

import com.example.backendagile.entities.Rubrique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RubriquePrsRepository extends JpaRepository<Rubrique, Long> {
    @Query("SELECT r FROM Rubrique r WHERE r.noEnseignant.id = :noEnseignant")
    List<Rubrique> findByNoEnseignant_NoEnseignant(Long noEnseignant);

}
