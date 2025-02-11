package com.example.backendagile.repositories;


import com.example.backendagile.entities.Authentification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthentificationRepository extends JpaRepository<Authentification, Long> {
    Authentification findByLoginConnectionAndMotPasse(String loginConnection, String motPasse);
}