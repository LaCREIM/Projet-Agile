package com.example.backendagile.services;

import com.example.backendagile.dto.*;
import com.example.backendagile.entities.*;
import com.example.backendagile.mapper.QuestionReponseMapper;
import com.example.backendagile.mapper.ReponseEvaluationMapper;
import com.example.backendagile.repositories.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.example.backendagile.mapper.RubriqueReponseMapper;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReponseEvaluationService {

    private final ReponseEvaluationRepository reponseEvaluationRepository;
    private final EvaluationRepository evaluationRepository;
    private final EtudiantRepository etudiantRepository;
    private final FormationRepository formationRepository;
    private final EvaluationService evaluationService;
    private final RubriqueEvaluationRepository rubriqueEvaluationRepository;
    private final RubriqueReponseMapper rubriqueReponseMapper;
    private final QuestionEvaluationRepository questionEvaluationRepository;
    private final ReponseQuestionRepository reponseQuestionRepository;
    private final QuestionReponseMapper questionReponseMapper;
    private final ReponseEvaluationMapper reponseEvaluationMapper;
    private final RubriqueRepository rubriqueRepository;
    private final QuestionRepository questionRepository;

    public ReponseEvaluationService(ReponseEvaluationRepository reponseEvaluationRepository, EvaluationRepository evaluationRepository, EtudiantRepository etudiantRepository, EvaluationService evaluationService, RubriqueEvaluationRepository rubriqueEvaluationRepository, RubriqueReponseMapper rubriqueReponseMapper, QuestionEvaluationRepository questionEvaluationRepository, ReponseQuestionRepository reponseQuestionRepository, QuestionReponseMapper questionReponseMapper, ReponseEvaluationMapper reponseEvaluationMapper, RubriqueRepository rubriqueRepository, QuestionRepository questionRepository, FormationRepository formationRepository) {
        this.reponseEvaluationRepository = reponseEvaluationRepository;
        this.evaluationRepository = evaluationRepository;
        this.etudiantRepository = etudiantRepository;
        this.evaluationService = evaluationService;
        this.rubriqueEvaluationRepository = rubriqueEvaluationRepository;
        this.rubriqueReponseMapper = rubriqueReponseMapper;
        this.questionEvaluationRepository = questionEvaluationRepository;
        this.reponseQuestionRepository = reponseQuestionRepository;
        this.questionReponseMapper = questionReponseMapper;
        this.reponseEvaluationMapper = reponseEvaluationMapper;
        this.rubriqueRepository = rubriqueRepository;
        this.questionRepository = questionRepository;
        this.formationRepository = formationRepository;
    }

    /*public ReponseEvaluationDTO addReponse(ReponseEvaluationDTO dto) {
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
    }*/

    public ReponseEvaluationDTO getReponsesByEvaluationByEtudiant(Long idEvaluation, String idEtudiant) {
        //Get evqluation en utilisant evaluationDTO, on mappe ensuite avec ReponseEvaluationDTO
        Evaluation evaluation = evaluationRepository.findByIdEvaluation(idEvaluation);
        if (evaluation == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Évaluation non trouvée");
        }
        EvaluationDTO evaluationDTO = evaluationService.mapEvaulation(evaluation);

        //Get commentaires de l'etudiant
        ReponseEvaluation reponse = reponseEvaluationRepository.findByIdEvaluation_IdAndNoEtudiant_NoEtudiant(idEvaluation, idEtudiant);
        String commentaire = reponse.getCommentaire();
        Long idReponseEvaluation = reponse.getId();
        System.out.println("idReponseEvaluation: " + idReponseEvaluation);

        //get les rubriques de l'evaluation avec les questions et leurs qualificatifs et le positionnement

        //get Rubriques
        List<RubriqueEvaluation> rubriques = rubriqueEvaluationRepository.findAllByIdEvaluation(idEvaluation);
        List<RubriqueReponseDTO> rubriqueReponseDTOs = rubriques.stream().map(rubriqueReponseMapper::toDTO).collect(Collectors.toList());

        for (RubriqueReponseDTO rubriqueReponseDTO : rubriqueReponseDTOs) {
            //get  designations de rubriques
            String designation = rubriqueRepository.findDesignation(rubriqueReponseDTO.getIdRubrique());
            rubriqueReponseDTO.setDesignation(designation);
            //get questions
            List<QuestionEvaluation> questions = questionEvaluationRepository.findQuestionEvaluationsById(rubriqueReponseDTO.getIdRubriqueEvaluation());
            List<QuestionReponseDTO> questionReponseDTOs = new ArrayList<>();
            //get positionnement
            for (QuestionEvaluation question : questions) {
                Long positionnement = reponseQuestionRepository.findPositionnement(idReponseEvaluation, question.getId());
                QuestionReponseDTO questionReponseDTO = questionReponseMapper.toDTO(question, positionnement);
                String intitule = questionRepository.findIntitule(questionReponseDTO.getIdQuestion());
                questionReponseDTO.setIntitule(intitule);
                questionReponseDTOs.add(questionReponseDTO);
            }
            rubriqueReponseDTO.setQuestions(questionReponseDTOs);

        }
        //Mapper avec ReponseEvaluationDTO

        return reponseEvaluationMapper.toDTO(evaluationDTO, rubriqueReponseDTOs, idEtudiant, commentaire);
    }

    public List<ReponseEvaluationPourEtudiantDTO> getReponsesByEvaluation(Long idEvaluation) {
        // Fetch the evaluation
        Evaluation evaluation = evaluationRepository.findById(idEvaluation)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Évaluation non trouvée"));

        // Fetch the formation
        String codeFormation = evaluation.getCodeFormation();
        Formation formation = formationRepository.findById(codeFormation)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Formation non trouvée"));

        // Fetch the responses
        List<ReponseEvaluation> reponses = reponseEvaluationRepository.findByIdEvaluation_Id(idEvaluation);

        // Map the responses to DTOs

        // Return the list of DTOs
        return reponses.stream()
                .map(reponse -> {
                    ReponseEvaluationPourEtudiantDTO dto = new ReponseEvaluationPourEtudiantDTO();
                    dto.setIdReponseEvaluation(reponse.getId());
                    dto.setIdEvaluation(reponse.getIdEvaluation().getId());
                    dto.setCommentaire(reponse.getCommentaire());
                    dto.setNomFormation(formation.getNomFormation());
                    dto.setPromotion(evaluation.getPromotion().getAnneeUniversitaire());
                    dto.generateHashedIdEtudiant(reponse.getNoEtudiant().getNoEtudiant());
                    return dto;
                })
                .sorted(Comparator.comparingInt(dto -> dto.getIdEtudiant().hashCode()))
                .collect(Collectors.toList());
    }
}
