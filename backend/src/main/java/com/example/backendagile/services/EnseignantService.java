package com.example.backendagile.services;

import com.example.backendagile.entities.Enseignant;
import com.example.backendagile.repositories.EnseignantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

@Service
public class EnseignantService {

    @Autowired
    private EnseignantRepository enseignantRepository;


    public Page<Enseignant> findAllWithPagination(Pageable pageable) {
        return enseignantRepository.findAll(pageable);
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
}