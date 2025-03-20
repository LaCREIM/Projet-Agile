package com.example.backendagile.controllers;

import com.example.backendagile.dto.EnseignantDTO;
import com.example.backendagile.dto.QuestionStatistiqueDTO;
import com.example.backendagile.services.DroitService;
import com.example.backendagile.services.ReponseEvaluationService;
import org.springframework.http.ResponseEntity;
import com.example.backendagile.dto.EvaluationDTO;
import com.example.backendagile.dto.EvaluationPartagerDTO;
import com.example.backendagile.services.EvaluationService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.transaction.Transactional;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/evaluations")
@CrossOrigin(origins = "*")
public class EvaluationController {

    private final EvaluationService evaluationService;
    private final DroitService droitService;
    private final ReponseEvaluationService reponseEvaluationService;

    public EvaluationController(EvaluationService evaluationService, DroitService droitService, ReponseEvaluationService reponseEvaluationService) {
        this.evaluationService = evaluationService;
        this.reponseEvaluationService = reponseEvaluationService;
        this.droitService = droitService;
    }

    @GetMapping("/enseignant/{id}")
    public ResponseEntity<List<EvaluationDTO>> getEvaluationsByEnseignant(@PathVariable Long id) {
        return ResponseEntity.ok(evaluationService.getEvaluationsByEnseignant(id));
    }


    @PostMapping
    public ResponseEntity<?> createEvaluation(@RequestBody EvaluationDTO dto) {
        try {
            EvaluationDTO savedDto = evaluationService.createEvaluation(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedDto);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("L'evaluation existe déjà.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<EvaluationDTO> updateEvaluation(
            @PathVariable Long id,
            @RequestBody EvaluationDTO dto) {
        return evaluationService.updateEvaluation(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{idEvaluation}")
    @Transactional
    public ResponseEntity<Map<String, String>> deleteEvaluation(@PathVariable Long idEvaluation) {
        Map<String, String> response = new HashMap<>();
        try {
            // supprimer l'évaluation droite
//            droitService.deleteDroitByIdEvaluation(idEvaluation);
            // supprimer l'évaluation
            evaluationService.deleteEvaluation(idEvaluation);
            response.put("message", "L'évaluation a été supprimée avec succès.");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            response.put("message", "L'évaluation ne peut pas être supprimée car elle est déjà remplie.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/{idEvaluation}")
    public ResponseEntity<EvaluationDTO> getEvaluation(
            @PathVariable Long idEvaluation) {
        EvaluationDTO evaluation = evaluationService.getEvaluationByEnseignantAndId(idEvaluation);
        return ResponseEntity.ok(evaluation);
    }

    @GetMapping("/evaluations-partage/{noEnseignant}")
    public ResponseEntity<List<EvaluationPartagerDTO>> getEvaluationsPartagees(@PathVariable Long noEnseignant) {
        return ResponseEntity.ok(evaluationService.getEvaluationsPartagees(noEnseignant));

    }

    @Transactional
    @PostMapping("/dupliquer/{idEvaluation}/{noEnseignant}")
    public ResponseEntity<Map<String, Object>> dupliquerEvaluation(@PathVariable Long idEvaluation, @PathVariable Long noEnseignant, @RequestBody EvaluationDTO evaluationDTO) {
        Map<String, Object> response = new HashMap<>();
        try {
            evaluationService.dupliquerEvaluation(idEvaluation, noEnseignant, evaluationDTO);
            response.put("message", "La duplication de l'évaluation a été effectuée avec succès.");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            response.put("message", "L'évaluation ne peut pas être dupliquée.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

    }
 

   /*  @GetMapping("/etudiant/{idEtudiant}")
    public ResponseEntity<Map<String, Object>> getEvaluationsByEtudiant(@PathVariable String idEtudiant) {
        try {
            Map<String, Object> response = evaluationService.getEvaluationsByEtudiant(idEtudiant);
            return ResponseEntity.ok(response);
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode())
                    .body(Collections.singletonMap("message", ex.getReason()));
        }
    }*/

    @GetMapping("/etudiant/{idEtudiant}")
    public ResponseEntity<List<EvaluationDTO>> getEvaluationsByEtudiant(@PathVariable String idEtudiant) {
        List<EvaluationDTO> evaluations = evaluationService.getEvaluationsByEtudiant(idEtudiant);
        return ResponseEntity.ok(evaluations);
    }

    @PutMapping("clouter/{idEvaluation}")
    public ResponseEntity<Map<String, String>> cloturerEvaluation(@PathVariable Long idEvaluation) {
        Map<String, String> response = new HashMap<>();
        try {
            boolean isUpdated = evaluationService.updateEvaluationStatus(idEvaluation, "CLO");
            if (isUpdated) {
                response.put("message", "L'évaluation a été clôturée avec succès.");
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "L'état initial de l'évaluation n'est pas en cours d'élaboration");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            response.put("message", "Une erreur s'est produite lors de la clôture de l'évaluation.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping("disposition/{idEvaluation}")
    public ResponseEntity<Map<String, String>> miseEnDispositionEvaluation(@PathVariable Long idEvaluation) {
        Map<String, String> response = new HashMap<>();
        try {
            boolean isUpdated = evaluationService.updateEvaluationStatus(idEvaluation, "DIS");
            if (isUpdated) {
                response.put("message", "L'évaluation a été mise en disposition avec succès.");
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "L'état initial de l'évaluation n'est pas en cours d'élaboration");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            response.put("message", "Une erreur s'est produite lors de la mise en disposition de l'évaluation.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/statistiques/{idEvaluation}")
    public ResponseEntity<List<QuestionStatistiqueDTO>> getStatistiquesByEvaluation(@PathVariable Long idEvaluation) {
        List<QuestionStatistiqueDTO> statistiques = reponseEvaluationService.getStatistiquesByEvaluation(idEvaluation);
        return ResponseEntity.ok(statistiques);
    }
}
