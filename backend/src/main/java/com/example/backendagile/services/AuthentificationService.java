package com.example.backendagile.services;

import com.example.backendagile.entities.Authentification;
import com.example.backendagile.entities.Enseignant;
import com.example.backendagile.entities.Etudiant;
import com.example.backendagile.repositories.AuthentificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthentificationService {

    @Autowired
    private AuthentificationRepository authentificationRepository;

    public Authentification authenticate(String loginConnection, String motPasse) {
        return authentificationRepository.findByLoginConnectionAndMotPasse(loginConnection, motPasse);
    }

    public Authentification save(String role, String loginConnection, String pseudoConnection, String motPasse, Enseignant noEnseignant, Etudiant noEtudiant) {
        Authentification authentification = new Authentification();
        authentification.setRole(role);
        authentification.setLoginConnection(loginConnection);
        authentification.setPseudoConnection(pseudoConnection);
        authentification.setMotPasse(motPasse);
        authentification.setNoEnseignant(noEnseignant);
        authentification.setNoEtudiant(noEtudiant);

        return authentificationRepository.save(authentification);
    }
}