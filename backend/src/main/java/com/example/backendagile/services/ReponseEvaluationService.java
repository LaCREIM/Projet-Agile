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
import java.util.Map;
import java.util.Optional;
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



    public String addReponseEvaluation(ReponseEvaluationDTO reponseEvaluationDTO){
        try {
            //Get evaluation
            Evaluation evaluation = evaluationRepository.findByIdEvaluation(reponseEvaluationDTO.getIdEvaluation());
            if (evaluation == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Évaluation non trouvée");
            }
            //Get etudiant
            Optional<Etudiant> etudiant = etudiantRepository.findById(reponseEvaluationDTO.getIdEtudiant());
            if (etudiant.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Étudiant non trouvé");
            }

            //Save reponseEvaluation
            ReponseEvaluation reponseEvaluation = new ReponseEvaluation();
            reponseEvaluation.setIdEvaluation(evaluation);
            reponseEvaluation.setNoEtudiant(etudiant.get());
            reponseEvaluation.setCommentaire(reponseEvaluationDTO.getCommentaire());
            reponseEvaluation.setNom(etudiant.get().getNom());
            reponseEvaluation.setPrenom(etudiant.get().getPrenom());
            ReponseEvaluation reponseSaved = reponseEvaluationRepository.save(reponseEvaluation);

            //looper pour chaque rubrique
            for (RubriqueReponseDTO rubriqueReponseDTO : reponseEvaluationDTO.getRubriques()) {
                //get rubrique
                RubriqueEvaluation rubriqueEvaluation = rubriqueEvaluationRepository.findByIdEvaluationAndIdRubrique(evaluation.getId(), rubriqueReponseDTO.getIdRubrique());
                if (rubriqueEvaluation == null) {
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Rubrique non trouvée");
                }
                //looper pour chaque question
                for (QuestionReponseDTO questionReponseDTO : rubriqueReponseDTO.getQuestions()) {
                    //get question
                    QuestionEvaluation questionEvaluation = questionEvaluationRepository.findQuestionEvaluationByIdRubriqueEvaluationAndIdQuestion(rubriqueEvaluation.getId(), questionReponseDTO.getIdQuestion());
                    if (questionEvaluation == null) {
                        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Question non trouvée");
                    }
                    //save reponseQuestion
                    ReponseQuestion reponseQuestion = new ReponseQuestion();
                    reponseQuestion.setId(new ReponseQuestionId(reponseSaved.getId(), questionEvaluation.getId()));
                    reponseQuestion.setIdReponseEvaluation(reponseSaved);
                    reponseQuestion.setIdQuestionEvaluation(questionEvaluation);
                    reponseQuestion.setPositionnement(questionReponseDTO.getPositionnement());
                    reponseQuestionRepository.save(reponseQuestion);
                }
            }
            return "Reponse Evaluation ajoutée avec succès";
        } catch (Exception e) {
//            return "Erreur lors de l'ajout de la réponse à l'évaluation";
              return  e.getMessage();
            }

    }

    public String updateReponseEvaluation(Long idEvaluation, String idEtudiant, ReponseEvaluationDTO reponseEvaluationDTO) {
        try {
            // Vérifier l'évaluation
            Evaluation evaluation = evaluationRepository.findByIdEvaluation(idEvaluation);
            if (evaluation == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Évaluation non trouvée");
            }

            // Vérifier l'étudiant
            Optional<Etudiant> etudiant = etudiantRepository.findById(idEtudiant);
            if (etudiant.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Étudiant non trouvé");
            }

            // Récupérer la réponse d'évaluation existante ou en créer une nouvelle
            ReponseEvaluation reponseEvaluation = reponseEvaluationRepository.findByIdEvaluation_IdAndNoEtudiant_NoEtudiant(idEvaluation, idEtudiant);
            if (reponseEvaluation == null) {
                // Si la réponse n'existe pas, on en crée une nouvelle
                reponseEvaluation = new ReponseEvaluation();
                reponseEvaluation.setIdEvaluation(evaluation);
                reponseEvaluation.setNoEtudiant(etudiant.get());
                reponseEvaluation.setCommentaire(reponseEvaluationDTO.getCommentaire());
                reponseEvaluation.setNom(etudiant.get().getNom());
                reponseEvaluation.setPrenom(etudiant.get().getPrenom());
                reponseEvaluation = reponseEvaluationRepository.save(reponseEvaluation);
                System.out.println("Nouvelle réponse d'évaluation créée: " + reponseEvaluation.getIdEvaluation().getId() + " id étudiant: " + reponseEvaluation.getNoEtudiant().getNoEtudiant());
            } else {
                // Si la réponse existe, on la met à jour
                reponseEvaluation.setCommentaire(reponseEvaluationDTO.getCommentaire());
                reponseEvaluation.setNom(etudiant.get().getNom());
                reponseEvaluation.setPrenom(etudiant.get().getPrenom());
                reponseEvaluation = reponseEvaluationRepository.save(reponseEvaluation);
                System.out.println("Réponse d'évaluation mise à jour: " + reponseEvaluation.getIdEvaluation().getId() + " id étudiant: " + reponseEvaluation.getNoEtudiant().getNoEtudiant());
            }

            // Supprimer toutes les réponses aux questions existantes liées à cette évaluation
            reponseQuestionRepository.deleteByIdReponseEvaluation(reponseEvaluation.getId());

            // Réinsérer les nouvelles réponses aux questions depuis le DTO
            for (RubriqueReponseDTO rubriqueReponseDTO : reponseEvaluationDTO.getRubriques()) {
                RubriqueEvaluation rubriqueEvaluation = rubriqueEvaluationRepository.findByIdEvaluationAndIdRubrique(evaluation.getId(), rubriqueReponseDTO.getIdRubrique());
                if (rubriqueEvaluation == null) {
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Rubrique non trouvée");
                }

                for (QuestionReponseDTO questionReponseDTO : rubriqueReponseDTO.getQuestions()) {
                    QuestionEvaluation questionEvaluation = questionEvaluationRepository.findQuestionEvaluationByIdRubriqueEvaluationAndIdQuestion(rubriqueEvaluation.getId(), questionReponseDTO.getIdQuestion());
                    if (questionEvaluation == null) {
                        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Question non trouvée");
                    }

                    // Recréer chaque réponse
                    ReponseQuestion reponseQuestion = new ReponseQuestion();
                    reponseQuestion.setId(new ReponseQuestionId(reponseEvaluation.getId(), questionEvaluation.getId()));
                    reponseQuestion.setIdReponseEvaluation(reponseEvaluation);
                    reponseQuestion.setIdQuestionEvaluation(questionEvaluation);
                    reponseQuestion.setPositionnement(questionReponseDTO.getPositionnement());
                    reponseQuestionRepository.save(reponseQuestion);
                }
            }

            return "Réponse d'évaluation mise à jour avec succès";

        } catch (Exception e) {
//            return e.getMessage();
            return "Erreur lors de la mise à jour de la réponse à l'évaluation";
        }
    }



    public List<QuestionStatistiqueDTO> getStatistiquesByEvaluation(Long idEvaluation) {
        List<ReponseQuestion> reponses = reponseQuestionRepository.findReponseQuestionByIdQuestionEvaluation_Id(idEvaluation);

        Map<Long, Double> moyennePositionnementParQuestion = reponses.stream()
                .collect(Collectors.groupingBy(
                        rq -> rq.getIdQuestionEvaluation().getId(),
                        Collectors.averagingDouble(ReponseQuestion::getPositionnement)
                ));

        Map<Long, Long> nbReponsesParQuestion = reponses.stream()
                .collect(Collectors.groupingBy(
                        rq -> rq.getIdQuestionEvaluation().getId(),
                        Collectors.counting()
                ));

        Map<Long, long[]> totalPositionnementParQuestion = reponses.stream()
                .collect(Collectors.groupingBy(
                        rq -> rq.getIdQuestionEvaluation().getId(),
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> {
                                    long[] totals = new long[5];
                                    for (ReponseQuestion rq : list) {
                                        int positionnement = rq.getPositionnement().intValue();
                                        if (positionnement >= 1 && positionnement <= 5) {
                                            totals[positionnement - 1]++;
                                        }
                                    }
                                    return totals;
                                }
                        )
                ));

        return moyennePositionnementParQuestion.entrySet().stream()
                .map(entry -> {
                    Long questionId = entry.getKey();
                    ReponseQuestion rq = reponses.stream()
                            .filter(r -> r.getIdQuestionEvaluation().getId().equals(questionId))
                            .findFirst()
                            .orElseThrow();
                    String maximal = rq.getIdQuestionEvaluation().getIdQualificatif().getMaximal();
                    String minimal = rq.getIdQuestionEvaluation().getIdQualificatif().getMinimal();
                    String intitule = rq.getIdQuestionEvaluation().getIdQuestion().getIntitule();
                    String designation = rq.getIdQuestionEvaluation().getIdRubriqueEvaluation().getDesignation();
                    Long nbReponses = nbReponsesParQuestion.get(questionId);
                    long[] totalPositionnements = totalPositionnementParQuestion.get(questionId);
                    return new QuestionStatistiqueDTO(questionId, entry.getValue(), maximal, minimal, nbReponses, intitule,designation, totalPositionnements);
                })
                .collect(Collectors.toList());
    }
}
