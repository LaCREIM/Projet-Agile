package com.example.backendagile.controllers;

import com.example.backendagile.dto.EvaluationDTO;
import com.example.backendagile.dto.EvaluationPartagerDTO;
import com.example.backendagile.dto.QuestionStatistiqueDTO;
import com.example.backendagile.services.DroitService;
import com.example.backendagile.services.EvaluationService;
import com.example.backendagile.services.ReponseEvaluationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import com.fasterxml.jackson.databind.ObjectMapper;

@ExtendWith(SpringExtension.class)
@WebMvcTest(EvaluationController.class)
public class EvaluationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EvaluationService evaluationService;

    @MockBean
    private DroitService droitService;

    @MockBean
    private ReponseEvaluationService reponseEvaluationService;

    private EvaluationDTO evaluationDTO;

    @BeforeEach
    void setUp() {
        evaluationDTO = new EvaluationDTO();
        evaluationDTO.setIdEvaluation(1L);
        evaluationDTO.setNoEnseignant(100L);
        evaluationDTO.setNomEnseignant("John");
        evaluationDTO.setPrenomEnseignant("Doe");
        evaluationDTO.setCodeFormation("M2DOSI");
        evaluationDTO.setAnneeUniversitaire("2023-2024");
        evaluationDTO.setCodeUE("ISI");
        evaluationDTO.setDesignation("Evaluation ISI");
        evaluationDTO.setEtat("CLO");
        evaluationDTO.setPeriode("Du 22 septembre au 24 octobre");
        evaluationDTO.setDebutReponse(LocalDate.of(2024, 11, 1));
        evaluationDTO.setFinReponse(LocalDate.of(2024, 11, 12));
    }

    private static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testGetEvaluationsByEnseignant() throws Exception {
        List<EvaluationDTO> evaluations = Collections.singletonList(evaluationDTO);
        when(evaluationService.getEvaluationsByEnseignant(100L)).thenReturn(evaluations);

        mockMvc.perform(get("/api/evaluations/enseignant/100"))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(evaluations)))
                .andDo(print());
    }

    @Test
    void testCreateEvaluation_Success() throws Exception {
        when(evaluationService.createEvaluation(any(EvaluationDTO.class))).thenReturn(evaluationDTO);

        mockMvc.perform(post("/api/evaluations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(evaluationDTO)))
                .andExpect(status().isCreated())
                .andExpect(content().json(asJsonString(evaluationDTO)))
                .andDo(print());
    }

    @Test
    void testCreateEvaluation_Failure() throws Exception {
        when(evaluationService.createEvaluation(any(EvaluationDTO.class)))
                .thenThrow(new RuntimeException("L'evaluation existe déjà."));

        mockMvc.perform(post("/api/evaluations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(evaluationDTO)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("L'evaluation existe déjà."))
                .andDo(print());
    }

    @Test
    void testUpdateEvaluation_Success() throws Exception {
        when(evaluationService.updateEvaluation(anyLong(), any(EvaluationDTO.class)))
                .thenReturn(Optional.of(evaluationDTO));

        mockMvc.perform(put("/api/evaluations/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(evaluationDTO)))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(evaluationDTO)))
                .andDo(print());
    }

    @Test
    void testUpdateEvaluation_NotFound() throws Exception {
        when(evaluationService.updateEvaluation(anyLong(), any(EvaluationDTO.class)))
                .thenReturn(Optional.empty());

        mockMvc.perform(put("/api/evaluations/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(evaluationDTO)))
                .andExpect(status().isNotFound())
                .andDo(print());
    }

    @Test
    void testDeleteEvaluation_Success() throws Exception {
        doNothing().when(evaluationService).deleteEvaluation(1L);

        mockMvc.perform(delete("/api/evaluations/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("{\"message\":\"L'évaluation a été supprimée avec succès.\"}"))
                .andDo(print());
    }

    @Test
    void testDeleteEvaluation_Failure() throws Exception {
        doThrow(new RuntimeException("L'évaluation ne peut pas être supprimée.")).when(evaluationService).deleteEvaluation(1L);

        mockMvc.perform(delete("/api/evaluations/1"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("{\"message\":\"L'évaluation ne peut pas être supprimée car elle est déjà remplie.\"}"))
                .andDo(print());
    }

    @Test
    void testGetEvaluationById() throws Exception {
        when(evaluationService.getEvaluationByEnseignantAndId(1L)).thenReturn(evaluationDTO);

        mockMvc.perform(get("/api/evaluations/1"))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(evaluationDTO)))
                .andDo(print());
    }

    @Test
    void testGetEvaluationsByEtudiant() throws Exception {
        List<EvaluationDTO> evaluations = Collections.singletonList(evaluationDTO);
        when(evaluationService.getEvaluationsByEtudiant("123")).thenReturn(evaluations);

        mockMvc.perform(get("/api/evaluations/etudiant/123"))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(evaluations)))
                .andDo(print());
    }

    @Test
    void testCloturerEvaluation_Success() throws Exception {
        when(evaluationService.updateEvaluationStatus(1L, "CLO")).thenReturn(true);

        mockMvc.perform(put("/api/evaluations/clouter/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("{\"message\":\"L'évaluation a été clôturée avec succès.\"}"))
                .andDo(print());
    }

    @Test
    void testCloturerEvaluation_Failure() throws Exception {
        when(evaluationService.updateEvaluationStatus(1L, "CLO")).thenReturn(false);

        mockMvc.perform(put("/api/evaluations/clouter/1"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("{\"message\":\"L'état initial de l'évaluation n'est pas en cours d'élaboration\"}"))
                .andDo(print());
    }

    @Test
    void testGetStatistiquesByEvaluation() throws Exception {
        List<QuestionStatistiqueDTO> statistiques = List.of(new QuestionStatistiqueDTO());
        when(reponseEvaluationService.getStatistiquesByEvaluation(1L)).thenReturn(statistiques);

        mockMvc.perform(get("/api/evaluations/statistiques/1"))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(statistiques)))
                .andDo(print());
    }
}
