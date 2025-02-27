package com.example.backendagile.services;

import com.example.backendagile.entities.Enseignant;
import com.example.backendagile.repositories.AuthentificationRepository;
import com.example.backendagile.repositories.EnseignantRepository;
import com.example.backendagile.repositories.FormationRepository;
import com.example.backendagile.repositories.PromotionRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;

import org.springframework.transaction.annotation.Transactional;

@Service
public class EnseignantService {

    @Autowired
    private EnseignantRepository enseignantRepository;
    @Autowired
    private AuthentificationRepository authentificationRepository;
    @Autowired
    private PromotionRepository promotionRepository;

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

 

/*@Transactional
public void deleteById(Long id) {
    Optional<Enseignant> enseignant = enseignantRepository.findById(id);
    
    if (enseignant.isPresent()) {
        authentificationRepository.deleteByEnseignant(enseignant.get()); 
        enseignantRepository.deleteById(id); 
    } else {
        throw new EntityNotFoundException("Enseignant non trouvé");
    }
}*/

    @Transactional
    public void deleteById(Long id) {
        Optional<Enseignant> enseignantOpt = enseignantRepository.findById(id);

        if (enseignantOpt.isPresent()) {
            Enseignant enseignant = enseignantOpt.get();
            Long formationsCount = promotionRepository.countByEnseignant(enseignant);
            if (formationsCount > 0) {
                throw new DataIntegrityViolationException("Cet enseignant est responsable d'une formation et ne peut pas être supprimé.");
            }
            authentificationRepository.deleteByEnseignant(enseignant);

            enseignantRepository.deleteById(id);
        } else {
            throw new EntityNotFoundException("L'enseignant avec l'ID " + id + " n'existe pas.");
        }
    }


    public List<Enseignant> getByNomAndPrenom(String nom, String prenom) {
        return enseignantRepository.findByNomAndPrenom(nom, prenom);
    }

    public Optional<Enseignant> findByEmailUbo(String emailUbo) {
        return enseignantRepository.findByEmailUbo(emailUbo).stream().findFirst();
    }

    public Optional<Enseignant> findByEmailPerso(String emailPerso) {
        return enseignantRepository.findByEmailPerso(emailPerso).stream().findFirst();
    }

    public List<Enseignant> getEnseignant() {
        return enseignantRepository.findAll();
    }

    public Object getTotalPages(int size) {
        return Math.ceil((double) enseignantRepository.count() / size);
    }
}