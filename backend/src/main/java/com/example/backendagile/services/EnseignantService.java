package com.example.backendagile.services;

import com.example.backendagile.entities.Enseignant;
import com.example.backendagile.repositories.EnseignantRepository;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;

@Service
public class EnseignantService {

    @Autowired
    private EnseignantRepository enseignantRepository;


    public List<Enseignant> getEnseignantPaged(int page, int size) {
        int startRow = (page - 1) * size;
        int endRow = page * size;
        return enseignantRepository.findAllWithPagination(startRow, endRow);
    }


    public Optional<Enseignant> findById(Long id) {
        return enseignantRepository.findById(id);
    }

    public Enseignant save(Enseignant enseignant) {
        return enseignantRepository.save(enseignant);
    }

    public void deleteById(Long id) {
        enseignantRepository.deleteById(id);
    }

    public List<Enseignant> getByNomAndPrenom(String nom, String prenom) {
        return enseignantRepository.findByNomAndPrenom(nom, prenom);
    }

    public Optional<Enseignant> findByEmail(String emailUbo) {
        return enseignantRepository.findByEmailUbo(emailUbo).stream().findFirst();
    }
}