package com.example.backendagile.services;
import org.springframework.stereotype.Service;
import com.example.backendagile.repositories.UniteEnseignementRepository;
import com.example.backendagile.dto.UniteEnseignementDTO;
import java.util.List;

@Service
public class UniteEnseignementService {

    private final UniteEnseignementRepository uniteEnseignementRepository;

    public UniteEnseignementService(UniteEnseignementRepository uniteEnseignementRepository) {
        this.uniteEnseignementRepository = uniteEnseignementRepository;
    }

    public List<UniteEnseignementDTO> getAllUnitesEnseignement() {
        return uniteEnseignementRepository.findAllUesWithCodeAndDesignation();
    }
}