package com.example.backendagile.services;

import com.example.backendagile.dto.EvaluationDTO;
import com.example.backendagile.dto.EvaluationPartagerDTO;
import com.example.backendagile.entities.Droit;
import com.example.backendagile.entities.Enseignant;
import com.example.backendagile.entities.Evaluation;
import com.example.backendagile.mapper.EvaluationMapper;
import com.example.backendagile.mapper.EvaluationPartagerMapper;
import com.example.backendagile.repositories.DroitRepository;
import com.example.backendagile.repositories.EvaluationRepository;
import com.example.backendagile.repositories.FormationRepository;
import com.example.backendagile.repositories.UniteEnseignementRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;

    private final FormationRepository formationRepository;

    private final DroitRepository droitRepository;

    private final EnseignantService enseignantService;

    private final EvaluationPartagerMapper evaluationPartagerMapper;

    private final UniteEnseignementRepository uniteEnseignementRepository;

    public EvaluationService(EvaluationRepository evaluationRepository, FormationRepository formationRepository, DroitRepository droitRepository, EnseignantService enseignantService, EvaluationPartagerMapper evaluationPartagerMapper, UniteEnseignementRepository uniteEnseignementRepository) {
        this.evaluationRepository = evaluationRepository;
        this.formationRepository = formationRepository;
        this.droitRepository = droitRepository;
        this.enseignantService = enseignantService;
        this.evaluationPartagerMapper = evaluationPartagerMapper;
        this.uniteEnseignementRepository = uniteEnseignementRepository;
    }


    public boolean isEvaluationUnique(String anneeUniversitaire, Long noEnseignant,
                                      Short noEvaluation, String codeFormation, String codeUE) {
        return !evaluationRepository.existsByUniqueConstraint(anneeUniversitaire, noEnseignant,
                noEvaluation, codeFormation, codeUE);
    }
    public List<EvaluationDTO> getEvaluationsByEnseignant(Long id) {
        List<Evaluation> evaluations = evaluationRepository.findByEnseignant_Id(id);

        return evaluations.stream().map(this::mapEvaulation).collect(Collectors.toList());
    }

    public EvaluationDTO createEvaluation(EvaluationDTO dto) {
        //validate is the evaluation is unique?
        if (!isEvaluationUnique(dto.getAnneeUniversitaire(), dto.getNoEnseignant(), dto.getNoEvaluation(), dto.getCodeFormation(), dto.getCodeUE())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'évaluation existe déjà.");
        }
        // Validate input DTO
        if (dto.getCodeFormation() == null || dto.getCodeFormation().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le code de formation est requis.");
        }
        if (dto.getAnneeUniversitaire() == null || dto.getAnneeUniversitaire().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'année universitaire est requise.");
        }
        if (dto.getCodeUE() == null || dto.getCodeUE().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le code UE est requis.");
        }
        if (dto.getDebutReponse() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La date de début de réponse est requise.");
        }
        if (dto.getFinReponse() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La date de fin de réponse est requise.");
        }
        if (dto.getNoEnseignant() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le numéro de l'enseignant est requis.");
        }

        // Set default state
        dto.setEtat("ELA");

        // Convert DTO to entity
        Evaluation evaluation = EvaluationMapper.toEntity(dto, uniteEnseignementRepository);

        // Check if the entity is valid before saving
        if (evaluation.getCodeFormation() == null) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Le code de formation est NULL avant l'insertion.");
        }

        // Save the entity
        Evaluation saved = evaluationRepository.save(evaluation);

        // Convert saved entity to DTO
        return EvaluationMapper.toDTO(saved,uniteEnseignementRepository);
    }


    public EvaluationDTO getEvaluationByEnseignantAndId(Long idEvaluation) {
        return mapEvaulation(evaluationRepository.findByIdEvaluation(idEvaluation));
    }

    private EvaluationDTO getEvaluationDTO(Evaluation evaluation) {
        EvaluationDTO dto = EvaluationMapper.toDTO(evaluation,uniteEnseignementRepository);

        formationRepository.findById(evaluation.getCodeFormation()).ifPresent(formation -> {
            dto.setNomFormation(formation.getNomFormation());
        });

        if (evaluation.getEnseignant() != null) {
            dto.setNomEnseignant(evaluation.getEnseignant().getNom());
            dto.setPrenomEnseignant(evaluation.getEnseignant().getPrenom());
        }

        return dto;
    }


    public Optional<EvaluationDTO> updateEvaluation(Long id, EvaluationDTO dto) {
        return evaluationRepository.findById(id).map(existingEvaluation -> {
            existingEvaluation.setDesignation(dto.getDesignation());
            existingEvaluation.setCodeEC(dto.getCodeEC());
            existingEvaluation.setCodeUE(dto.getCodeUE());
            existingEvaluation.setCodeFormation(dto.getCodeFormation());
            existingEvaluation.setAnneeUniversitaire(dto.getAnneeUniversitaire());
            existingEvaluation.setNoEvaluation(dto.getNoEvaluation());
            existingEvaluation.setEtat(dto.getEtat());
            existingEvaluation.setPeriode(dto.getPeriode());
            existingEvaluation.setDebutReponse(dto.getDebutReponse());
            existingEvaluation.setFinReponse(dto.getFinReponse());
            Evaluation updated = evaluationRepository.save(existingEvaluation);
            return EvaluationMapper.toDTO(updated,uniteEnseignementRepository);
        });
    }

    public void deleteEvaluation(Long id) {
        evaluationRepository.deleteById(id);
    }

    public Evaluation getEvaluationByID(Long id) {
        return evaluationRepository.findByIdEvaluation(id);
    }

    public List<EvaluationPartagerDTO> getEvaluationsPartagees(Long noEnseignant) {
        List<Droit> droits = droitRepository.findByEnseignant_Id(noEnseignant);

        List<EvaluationPartagerDTO> evaluations = droits.stream().map(evaluationPartagerMapper::fromDroit).collect(Collectors.toList());

        //Get evaluation pour un ENseignant
        List<EvaluationDTO> evaluationsEnseignant = getEvaluationsByEnseignant(noEnseignant);

        evaluationsEnseignant.forEach(evaluationDTO -> {
            EvaluationPartagerDTO evaluationPartagerDTO = evaluationPartagerMapper.fromEvaluationDTO(evaluationDTO);
            evaluations.add(evaluationPartagerDTO);
        });
        return evaluations;
    }

    public void dupliquerEvaluation(Long idEvaluation, Long noEnseignant) {
        Evaluation evaluation = getEvaluationByID(idEvaluation);
        Optional<Enseignant> enseignant = enseignantService.findById(noEnseignant);
        Evaluation evaluationCopy = evaluation.copy();
        evaluationCopy.setEnseignant(enseignant.orElse(null));
        evaluationRepository.save(evaluationCopy);
    }


    private EvaluationDTO mapEvaulation(Evaluation evaluation) {
        return getEvaluationDTO(evaluation);
    }
}
