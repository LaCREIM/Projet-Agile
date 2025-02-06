package com.example.backendagile.services;

import com.example.backendagile.entities.Etudiant;
import com.example.backendagile.repositories.EtudiantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EtudiantService {

    @Autowired
    private EtudiantRepository etudiantRepository;

    public List<Etudiant> findAll() {
        return etudiantRepository.findAll();
    }

    public Optional<Etudiant> findById(Long id) {
        return etudiantRepository.findById(id);
    }

    public Etudiant save(Etudiant etudiant) {
        return etudiantRepository.save(etudiant);
    }

    public List<Etudiant> findEtudiantsByPromotion(String anneeUniversitaire) {
        return etudiantRepository.findByPromotionCode(anneeUniversitaire);
    }

    public void deleteById(Long id) {
        etudiantRepository.deleteById(id);
    }
    
    public List<Etudiant> getEtudiantsPaged(int page, int size) {
        int startRow = (page - 1) * size;
        int endRow = page * size;
        return etudiantRepository.findAllWithPagination(startRow, endRow);
    }

}