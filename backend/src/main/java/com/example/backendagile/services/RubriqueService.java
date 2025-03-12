package com.example.backendagile.services;

import com.example.backendagile.entities.Rubrique;
import com.example.backendagile.repositories.RubriqueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RubriqueService {
    @Autowired
    private final RubriqueRepository rubriqueRepository;

    public RubriqueService(RubriqueRepository rubriqueRepository) {
        this.rubriqueRepository = rubriqueRepository;
    }

    public List<Rubrique> getRubriques() {
        return rubriqueRepository.findAll();
    }

    public List<Rubrique> getRubriquesPaged(long  enseignantId, int page, int size) {
        int startRow = page * size;
        int endRow = startRow + size;
        return rubriqueRepository.findAllWithPagination(enseignantId,startRow, endRow);
    }
}
