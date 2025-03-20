package com.example.backendagile.services;

import com.example.backendagile.dto.EnseignantDTO;
import com.example.backendagile.dto.EvaluationDTO;
import com.example.backendagile.dto.EvaluationPartagerDTO;
import com.example.backendagile.entities.*;
import com.example.backendagile.mapper.EvaluationMapper;
import com.example.backendagile.mapper.EvaluationPartagerMapper;
import com.example.backendagile.repositories.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.ErrorResponseException;
import org.springframework.web.server.ResponseStatusException;

import javax.transaction.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;

    private final FormationRepository formationRepository;

    private final DroitRepository droitRepository;
    private final EtudiantRepository etudiantRepository;

    private final EnseignantService enseignantService;

    private final QuestionEvaluationRepository questionEvaluationRepository;

    private final RubriqueEvaluationRepository rubriqueEvaluationRepository;

    private final EvaluationPartagerMapper evaluationPartagerMapper;

    private final UniteEnseignementRepository uniteEnseignementRepository;


    public EvaluationService(EvaluationRepository evaluationRepository, FormationRepository formationRepository, DroitRepository droitRepository, EnseignantService enseignantService, EvaluationPartagerMapper evaluationPartagerMapper, UniteEnseignementRepository uniteEnseignementRepository, QuestionEvaluationRepository questionEvaluationRepository, RubriqueEvaluationRepository rubriqueEvaluationRepository, EtudiantRepository etudiantRepository) {
        this.evaluationRepository = evaluationRepository;
        this.formationRepository = formationRepository;
        this.droitRepository = droitRepository;
        this.enseignantService = enseignantService;
        this.evaluationPartagerMapper = evaluationPartagerMapper;
        this.uniteEnseignementRepository = uniteEnseignementRepository;
        this.questionEvaluationRepository = questionEvaluationRepository;
        this.rubriqueEvaluationRepository = rubriqueEvaluationRepository;
        this.etudiantRepository = etudiantRepository;
    }


    public boolean isEvaluationUnique(String anneeUniversitaire, Long noEnseignant,
                                      Short noEvaluation, String codeFormation, String codeUE) {
        return !evaluationRepository.existsByUniqueConstraint(anneeUniversitaire, noEnseignant,
                noEvaluation, codeFormation, codeUE);
    }

    public List<EvaluationDTO> getEvaluationsByEnseignant(Long id) {
        List<Evaluation> evaluations = evaluationRepository.findByIdEnseignantEvaluationSorted(id);
        return evaluations.stream().map(this::mapEvaulation).collect(Collectors.toList());
    }

    public EvaluationDTO createEvaluation(EvaluationDTO dto) {
        if (!isEvaluationUnique(dto.getAnneeUniversitaire(), dto.getNoEnseignant(), dto.getNoEvaluation(), dto.getCodeFormation(), dto.getCodeUE())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'évaluation existe déjà.");
        }
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

        dto.setEtat("ELA");

        Evaluation evaluation = EvaluationMapper.toEntity(dto, uniteEnseignementRepository);

        if (evaluation.getCodeFormation() == null) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Le code de formation est NULL avant l'insertion.");
        }

        Evaluation saved = evaluationRepository.save(evaluation);

        return EvaluationMapper.toDTO(saved, uniteEnseignementRepository);
    }


    public EvaluationDTO getEvaluationByEnseignantAndId(Long idEvaluation) {
        return mapEvaulation(evaluationRepository.findByIdEvaluation(idEvaluation));
    }

    private EvaluationDTO getEvaluationDTO(Evaluation evaluation) {
        EvaluationDTO dto = EvaluationMapper.toDTO(evaluation, uniteEnseignementRepository);

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
            return EvaluationMapper.toDTO(updated, uniteEnseignementRepository);
        });
    }

    public void deleteEvaluation(Long id) {
        droitRepository.deleteDroitsByIdEvaluation_Id(id);
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

    public void dupliquerEvaluation(Long idEvaluation, Long noEnseignant, EvaluationDTO evaluationDTO) {
        Evaluation evaluation = getEvaluationByID(idEvaluation);
        Optional<Enseignant> enseignant = enseignantService.findById(noEnseignant);
        Evaluation evaluationCopy = evaluation.copy();
        evaluationCopy.setEnseignant(enseignant.orElse(null));
        evaluationCopy.setCodeEC(evaluationDTO.getCodeEC());
        evaluationCopy.setCodeUE(evaluationDTO.getCodeUE());
        evaluationCopy.setCodeFormation(evaluationDTO.getCodeFormation());
        evaluationCopy.setAnneeUniversitaire(evaluationDTO.getAnneeUniversitaire());
        evaluationCopy.setDesignation(evaluationDTO.getDesignation());
        evaluationCopy.setNoEvaluation(evaluationDTO.getNoEvaluation());
        evaluationCopy.setDebutReponse(evaluationDTO.getDebutReponse());
        evaluationCopy.setFinReponse(evaluationDTO.getFinReponse());
        evaluationCopy.setEtat("ELA");
        Evaluation newEvaluation = evaluationRepository.save(evaluationCopy);
        List<RubriqueEvaluation> rubriqueEvaluations = rubriqueEvaluationRepository.findAllByIdEvaluation(idEvaluation);
        for (RubriqueEvaluation rubriqueEvaluation : rubriqueEvaluations) {
            RubriqueEvaluation rubriqueEvaluationDupliquer = new RubriqueEvaluation();

            rubriqueEvaluationDupliquer.setDesignation(rubriqueEvaluation.getDesignation());
            rubriqueEvaluationDupliquer.setIdRubrique(rubriqueEvaluation.getIdRubrique());
            rubriqueEvaluationDupliquer.setOrdre(rubriqueEvaluation.getOrdre());
            rubriqueEvaluationDupliquer.setIdEvaluation(newEvaluation);

            RubriqueEvaluation rubriqueEvaluationDuplicated = rubriqueEvaluationRepository.save(rubriqueEvaluationDupliquer);

            List<QuestionEvaluation> questionEvaluations = rubriqueEvaluation.getQuestions();
            for (QuestionEvaluation questionEvaluation : questionEvaluations) {
                QuestionEvaluation questionEvaluationDupliquer = new QuestionEvaluation();
                questionEvaluationDupliquer.setIdQuestion(questionEvaluation.getIdQuestion());
                questionEvaluationDupliquer.setOrdre(questionEvaluation.getOrdre());
                questionEvaluationDupliquer.setIdQualificatif(questionEvaluation.getIdQualificatif());
                questionEvaluationDupliquer.setIdRubriqueEvaluation(rubriqueEvaluationDuplicated);
                questionEvaluationRepository.save(questionEvaluationDupliquer);
            }
        }


    }

    public EvaluationDTO mapEvaulation(Evaluation evaluation) {
        return getEvaluationDTO(evaluation);
    }

    /*public Map<String, Object> getEvaluationsByEtudiant(String idEtudiant) {
        Etudiant etudiant = etudiantRepository.findById(idEtudiant)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Étudiant non trouvé"));
    
        Promotion promotion = etudiant.getPromotion();
        if (promotion == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Aucune promotion trouvée pour cet étudiant");
        }
    
        String codeFormation = promotion.getCodeFormation();
        String anneeUniversitaire = promotion.getAnneeUniversitaire();
    
        String nomFormation = formationRepository.findById(codeFormation)
                .map(Formation::getNomFormation)
                .orElse("Formation inconnue");
    
        List<Evaluation> evaluations = evaluationRepository.findByPromotionAndEtatNotELA(codeFormation, anneeUniversitaire);
    
        List<Map<String, Object>> evaluationList = evaluations.stream().map(evaluation -> {
            Map<String, Object> map = new HashMap<>();
            map.put("noEvaluation", evaluation.getNoEvaluation());
            map.put("codeUE", evaluation.getCodeUE());
            map.put("designation", evaluation.getDesignation());
            map.put("etat", evaluation.getEtat());
            map.put("periode", evaluation.getPeriode());
            map.put("debutReponse", evaluation.getDebutReponse());
            map.put("finReponse", evaluation.getFinReponse());
            return map;
        }).collect(Collectors.toList());
    
        Map<String, Object> response = new HashMap<>();
        response.put("nomFormation", nomFormation); 
        response.put("anneeUniversitaire", anneeUniversitaire);
        response.put("evaluations", evaluationList);
    
        return response;
    }*/

    public List<EvaluationDTO> getEvaluationsByEtudiant(String idEtudiant) {
        Etudiant etudiant = etudiantRepository.findById(idEtudiant)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Étudiant non trouvé"));

        String codeFormation = etudiant.getCodeFormation();
        String anneeUniversitaire = etudiant.getAnneeUniversitaire();

        // Vérification que la formation existe et récupération du nom
        String nomFormation = formationRepository.findById(codeFormation)
                .map(formation -> formation.getNomFormation())
                .orElse("Formation inconnue");

        // Récupération des évaluations qui ne sont pas en cours d'élaboration
        List<Evaluation> evaluations = evaluationRepository.findByPromotionAndEtatNotELA(codeFormation, anneeUniversitaire);

        // Conversion des évaluations en DTO
        return evaluations.stream()
                .map(evaluation -> {
                    EvaluationDTO dto = EvaluationMapper.toDTO(evaluation, uniteEnseignementRepository);
                    dto.setNomFormation(nomFormation);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public boolean updateEvaluationStatus(Long idEvaluation, String etat) {
        Evaluation evaluation = evaluationRepository.findByIdEvaluation(idEvaluation);
        if (evaluation == null) {
            throw new ErrorResponseException(HttpStatus.NOT_FOUND);
        }
        evaluation.setEtat(etat);
        evaluationRepository.save(evaluation);
        return true;
    }
}
    

