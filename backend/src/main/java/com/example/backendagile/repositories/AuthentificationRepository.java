package com.example.backendagile.repositories;


import com.example.backendagile.entities.Authentification;
import com.example.backendagile.entities.Enseignant;
import com.example.backendagile.entities.Etudiant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthentificationRepository extends JpaRepository<Authentification, Long> {
    Authentification findByLoginConnectionAndMotPasse(String loginConnection, String motPasse);
 
@Modifying
@Query("DELETE FROM Authentification a WHERE a.noEnseignant = :enseignant")
void deleteByEnseignant(@Param("enseignant") Enseignant enseignant);
@Modifying
@Query("DELETE FROM Authentification a WHERE a.noEtudiant = :etudiant")
void deleteByEtudiant(@Param("etudiant") Etudiant etudiant);


}