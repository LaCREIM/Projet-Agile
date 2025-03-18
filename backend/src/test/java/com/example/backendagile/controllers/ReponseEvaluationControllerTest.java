package com.example.backendagile.controllers;

import com.example.backendagile.dto.ReponseEvaluationDTO;
import com.example.backendagile.dto.ReponseEvaluationPourEtudiantDTO;
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
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import com.fasterxml.jackson.databind.ObjectMapper;

@ExtendWith(SpringExtension.class)
@WebMvcTest(ReponseEvaluationController.class)
public class ReponseEvaluationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReponseEvaluationService reponseEvaluationService;

    private ReponseEvaluationDTO reponseEvaluationDTO;
    private ReponseEvaluationPourEtudiantDTO reponsePourEtudiantDTO;

    @BeforeEach
    void setUp() {
        reponseEvaluationDTO = new ReponseEvaluationDTO();
        reponseEvaluationDTO.setIdEvaluation(1L);
        reponseEvaluationDTO.setIdEtudiant("E12345");
        reponseEvaluationDTO.setCommentaire("Good evaluation");
        reponseEvaluationDTO.setNoEnseignant(100L);
        reponseEvaluationDTO.setNomEnseignant("John");
        reponseEvaluationDTO.setPrenomEnseignant("Doe");
        reponseEvaluationDTO.setCodeFormation("M2DOSI");
        reponseEvaluationDTO.setAnneeUniversitaire("2023-2024");
        reponseEvaluationDTO.setCodeUE("ISI");
        reponseEvaluationDTO.setDesignation("Evaluation ISI");
        reponseEvaluationDTO.setEtat("CLO");
        reponseEvaluationDTO.setPeriode("Du 22 septembre au 24 octobre");
        reponseEvaluationDTO.setDebutReponse(LocalDate.of(2024, 11, 1));
        reponseEvaluationDTO.setFinReponse(LocalDate.of(2024, 11, 12));

        reponsePourEtudiantDTO = new ReponseEvaluationPourEtudiantDTO();
        reponsePourEtudiantDTO.setIdEvaluation(1L);
        reponsePourEtudiantDTO.setIdEtudiant("E12345");
    }

    private static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testGetReponseEvaluationParEtudiant() throws Exception {
        when(reponseEvaluationService.getReponsesByEvaluationByEtudiant(1L, "E12345")).thenReturn(reponseEvaluationDTO);

        mockMvc.perform(get("/api/reponse-evaluation/1/E12345"))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(reponseEvaluationDTO)))
                .andDo(print());
    }

    @Test
    void testGetReponseEvaluation() throws Exception {
        List<ReponseEvaluationPourEtudiantDTO> reponses = Arrays.asList(reponsePourEtudiantDTO);
        when(reponseEvaluationService.getReponsesByEvaluation(1L)).thenReturn(reponses);

        mockMvc.perform(get("/api/reponse-evaluation/1"))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(reponses)))
                .andDo(print());
    }

    @Test
    void testGetReponseEvaluation_NotFound() throws Exception {
        when(reponseEvaluationService.getReponsesByEvaluation(1L)).thenThrow(new RuntimeException("Not found"));

        mockMvc.perform(get("/api/reponse-evaluation/1"))
                .andExpect(status().isNotFound())
                .andDo(print());
    }

    @Test
    void testCreateReponseEvaluation() throws Exception {
        when(reponseEvaluationService.addReponseEvaluation(any(ReponseEvaluationDTO.class))).thenReturn("Reponse enregistrée avec succès");

        mockMvc.perform(post("/api/reponse-evaluation")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(reponseEvaluationDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("Reponse enregistrée avec succès"))
                .andDo(print());
    }

    @Test
    void testUpdateReponseEvaluation() throws Exception {
        when(reponseEvaluationService.updateReponseEvaluation(anyLong(), anyString(), any(ReponseEvaluationDTO.class)))
                .thenReturn("Reponse mise à jour avec succès");

        mockMvc.perform(put("/api/reponse-evaluation/reponse-evaluation")
                .param("idEvaluation", "1")
                .param("idEtudiant", "E12345")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(reponseEvaluationDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("Reponse mise à jour avec succès"))
                .andDo(print());
    }
}
