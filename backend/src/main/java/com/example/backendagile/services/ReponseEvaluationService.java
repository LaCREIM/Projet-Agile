package com.example.backendagile.services;

import com.example.backendagile.dto.ReponseEvaluationDTO;
import com.example.backendagile.entities.ReponseEvaluation;
import com.example.backendagile.entities.Evaluation;
import com.example.backendagile.entities.Etudiant;
import com.example.backendagile.mapper.ReponseEvaluationMapper;
import com.example.backendagile.repositories.ReponseEvaluationRepository;
import com.example.backendagile.repositories.EvaluationRepository;
import com.example.backendagile.repositories.EtudiantRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReponseEvaluationService {

    private final ReponseEvaluationRepository reponseEvaluationRepository;
    private final EvaluationRepository evaluationRepository;
    private final EtudiantRepository etudiantRepository;

    public ReponseEvaluationService(ReponseEvaluationRepository reponseEvaluationRepository, EvaluationRepository evaluationRepository, EtudiantRepository etudiantRepository) {
        this.reponseEvaluationRepository = reponseEvaluationRepository;
        this.evaluationRepository = evaluationRepository;
        this.etudiantRepository = etudiantRepository;
    }

    public ReponseEvaluationDTO addReponse(ReponseEvaluationDTO dto) {
        Evaluation evaluation = evaluationRepository.findById(dto.getIdEvaluation())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Évaluation non trouvée"));

        if (!"DIS".equals(evaluation.getEtat())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vous ne pouvez répondre qu'aux évaluations mises à disposition.");
        }

        Etudiant etudiant = etudiantRepository.findById(dto.getIdEtudiant())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Étudiant non trouvé"));

        if (reponseEvaluationRepository.existsByIdEvaluation_IdAndNoEtudiant_NoEtudiant(dto.getIdEvaluation(), dto.getIdEtudiant())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vous avez déjà répondu à cette évaluation.");
        }

        ReponseEvaluation reponse = ReponseEvaluationMapper.toEntity(dto, etudiant, evaluation);
        reponse = reponseEvaluationRepository.save(reponse);

        return ReponseEvaluationMapper.toDTO(reponse);
    }

    public List<ReponseEvaluationDTO> getReponsesByEvaluation(Long idEvaluation) {
        List<ReponseEvaluation> reponses = reponseEvaluationRepository.findByIdEvaluation_Id(idEvaluation);
        return reponses.stream().map(ReponseEvaluationMapper::toDTO).collect(Collectors.toList());
    }
}
