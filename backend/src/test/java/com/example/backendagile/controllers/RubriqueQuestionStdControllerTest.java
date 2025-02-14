package com.example.backendagile.controllers;

import com.example.backendagile.dto.RubriqueQuestionStdDTO;
import com.example.backendagile.services.RubriqueQuestionStdService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RubriqueQuestionStdController.class)
public class RubriqueQuestionStdControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RubriqueQuestionStdService rubriqueQuestionStdService;

    @Autowired
    private ObjectMapper objectMapper;

    private RubriqueQuestionStdDTO rubriqueQuestionStdDTO;

    @BeforeEach
    void setUp() {
        rubriqueQuestionStdDTO = new RubriqueQuestionStdDTO(1L, "Rubrique Test", 10L, null, 1L);
    }

    /**
     *  Test : Récupération des questions d'une rubrique (cas succès)
     */
    @Test
    void testGetQuestionsByRubrique_Success() throws Exception {
        Mockito.when(rubriqueQuestionStdService.getQuestionsByRubrique(1L))
                .thenReturn(List.of(rubriqueQuestionStdDTO));

        mockMvc.perform(get("/api/rubrique-questions/standard/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(1))
                .andExpect(jsonPath("$[0].idRubrique").value(1))
                .andExpect(jsonPath("$[0].designationRubrique").value("Rubrique Test"));
    }

    /**
     *  Test : Récupération des questions d'une rubrique vide (cas NOT_FOUND)
     */
    @Test
    void testGetQuestionsByRubrique_NotFound() throws Exception {
        Mockito.when(rubriqueQuestionStdService.getQuestionsByRubrique(1L))
                .thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/rubrique-questions/standard/1"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Aucune question standard trouvée pour cette rubrique."));
    }

    /**
     *  Test : Récupération des questions d'une rubrique avec erreur serveur (cas INTERNAL_SERVER_ERROR)
     */
    @Test
    void testGetQuestionsByRubrique_ServerError() throws Exception {
        Mockito.when(rubriqueQuestionStdService.getQuestionsByRubrique(1L))
                .thenThrow(new RuntimeException("Erreur serveur"));

        mockMvc.perform(get("/api/rubrique-questions/standard/1"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.error").value("Une erreur est survenue."));
    }

    /**
     *  Test : Récupération de toutes les rubriques question standard (cas succès)
     */
    @Test
    void testGetAllRubriquesQuestionStd_Success() throws Exception {
        Mockito.when(rubriqueQuestionStdService.getAllRubriquesQuestionStd())
                .thenReturn(List.of(rubriqueQuestionStdDTO));

        mockMvc.perform(get("/api/rubrique-questions/standard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(1));
    }

    /**
     *  Test : Sauvegarde ou mise à jour des rubriques question standard (cas succès)
     */
    @Test
    void testSaveOrUpdateRubriqueQuestions_Success() throws Exception {
        mockMvc.perform(post("/api/rubrique-questions/standard/save-update")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(List.of(rubriqueQuestionStdDTO))))
                .andExpect(status().isNoContent());

        Mockito.verify(rubriqueQuestionStdService, Mockito.times(1))
                .saveOrUpdateRubriqueQuestions(any());
    }

    /**
     *  Test : Suppression d'une rubrique question standard (cas succès)
     */
    @Test
    void testDeleteRubriqueQuestion_Success() throws Exception {
        mockMvc.perform(delete("/api/rubrique-questions/standard/1/10"))
                .andExpect(status().isOk())
                .andExpect(content().string("Rubrique Question Standard supprimée avec succès."));
    }

    /**
     *  Test : Suppression d'une rubrique question standard inexistante (cas NOT_FOUND)
     */
    @Test
    void testDeleteRubriqueQuestion_NotFound() throws Exception {
        Mockito.doThrow(new IllegalArgumentException("Rubrique Question Standard non trouvée."))
                .when(rubriqueQuestionStdService).deleteRubriqueQuestion(1L, 10L);

        mockMvc.perform(delete("/api/rubrique-questions/standard/1/10"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Rubrique Question Standard non trouvée."));
    }

    /**
     *  Test : Suppression d'une rubrique question standard avec erreur serveur (cas INTERNAL_SERVER_ERROR)
     */
    @Test
    void testDeleteRubriqueQuestion_ServerError() throws Exception {
        Mockito.doThrow(new RuntimeException("Erreur serveur"))
                .when(rubriqueQuestionStdService).deleteRubriqueQuestion(1L, 10L);

        mockMvc.perform(delete("/api/rubrique-questions/standard/1/10"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Une erreur inattendue est survenue lors de la suppression."));
    }
}
