package com.example.backendagile.services;

import com.example.backendagile.entities.Qualificatif;
import com.example.backendagile.repositories.QualificatifRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QualificatifService {

    @Autowired
    private QualificatifRepository qualificatifRepository;

    public List<Qualificatif> findAll() {
        return qualificatifRepository.findAll();
    }

    public Optional<Qualificatif> findById(Long id) {
        return qualificatifRepository.findById(id);
    }

    public Qualificatif save(Qualificatif qualificatif) {
        return qualificatifRepository.save(qualificatif);
    }

    public void deleteById(Long id) {
        qualificatifRepository.deleteById(id);
    }
}