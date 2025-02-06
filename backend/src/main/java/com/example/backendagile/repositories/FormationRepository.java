package com.example.backendagile.repositories;

import com.example.backendagile.entities.Formation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface FormationRepository extends JpaRepository<Formation, String> {
    @Query("SELECT f.diplome FROM Formation f WHERE f.codeFormation = :codeFormation")
    Optional<String> findDiplomeByCodeFormation(String codeFormation);
}
