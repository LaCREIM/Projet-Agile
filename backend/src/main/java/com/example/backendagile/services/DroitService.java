package com.example.backendagile.services;


import com.example.backendagile.dto.DroitDTO;
import com.example.backendagile.entities.Droit;
import com.example.backendagile.entities.DroitId;
import com.example.backendagile.entities.Evaluation;
import com.example.backendagile.mapper.DroitMapper;
import com.example.backendagile.mapper.PromotionMapper;
import com.example.backendagile.repositories.DroitRepository;
import com.example.backendagile.repositories.EvaluationRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DroitService {

    private final DroitMapper droitMapper ;

    @Autowired
    private DroitRepository droitRepository;
    @Autowired
    private EvaluationRepository evaluationRepository;

    public DroitService(DroitMapper droitMapper, DroitRepository droitRepository) {
        this.droitMapper = droitMapper;
        this.droitRepository = droitRepository;
    }

    public List<DroitDTO> getDroitsByEvaluation(Long idEvaluation) {
        return droitRepository.findByIdEvaluation(idEvaluation).stream()
                .map(droit -> droitMapper.toDTO(droit))
                .collect(Collectors.toList());

    }

    public Droit createDroit(DroitDTO droitDTO) {
        Droit droit = droitMapper.toDroit(droitDTO);
        System.out.println("Droit : "+droit);
        return droitRepository.save(droit);
    }


    public Droit updateDroit(Long idEvaluation , Long idEnseignant, DroitDTO droitDTO) {
        DroitId id = new DroitId(idEvaluation, idEnseignant);
        return droitRepository.findById(id)
                .map(existingDroit -> {
                    Droit updatedDroit = droitMapper.toDroit(droitDTO);
                    updatedDroit.setId(id); // S'assurer que l'ID reste le même

                    return droitRepository.save(updatedDroit);
                })
                .orElseThrow(() -> new EntityNotFoundException("Droit non trouvé avec l'ID: " + id));
    }

    public void deleteDroit(Long idEvaluation, Long idEnseignant) {

        DroitId id = new DroitId(idEvaluation, idEnseignant);

        if (!droitRepository.existsById(id)) {
            throw new EntityNotFoundException("Droit non trouvé avec l'ID: " + id.getIdEvaluation() + " " + id.getNoEnseignant());
        }
        droitRepository.deleteById(id);
    }

    public Optional<Droit> findById(DroitId id) {
        return droitRepository.findByIdEvaluationAndIdEnseignant(id.getIdEvaluation(),id.getNoEnseignant().longValue()).stream().findFirst();
    }

}
