package com.example.backendagile.controllers;

import com.example.backendagile.dto.QuestionStdDTO;
import com.example.backendagile.entities.Question;
import com.example.backendagile.services.QuestionStdService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class QuestionStdControllerTest {

    private MockMvc mockMvc;

    @Mock
    private QuestionStdService questionStdService;

    @InjectMocks
    private QuestionStdController questionStdController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(questionStdController).build();
    }

    /**
     * Test récupérer toutes les questions standards (GET)
     */
    @Test
    void testGetAllStandardQuestions() throws Exception {
        when(questionStdService.getStandardQuestions()).thenReturn(Collections.singletonList(new Question()));

        mockMvc.perform(get("/api/questionsStd"))
                .andExpect(status().isOk());
    }

    /**
     * Test récupérer une question standard par ID (GET)
     */
    @Test
    void testGetStandardQuestionById() throws Exception {
        Question question = new Question();
        when(questionStdService.findById(anyLong())).thenReturn(Optional.of(question));

        mockMvc.perform(get("/api/questionsStd/1"))
                .andExpect(status().isOk());
    }

    /**
     * Test récupérer une question standard inexistante (GET)
     */
    @Test
    void testGetStandardQuestionByIdNotFound() throws Exception {
        when(questionStdService.findById(anyLong())).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/questionsStd/1"))
                .andExpect(status().isNotFound());
    }

    /**
     * Test créer une question standard avec un qualificatif existant (POST)
     */
    @Test
    void testCreateStandardQuestion() throws Exception {
        QuestionStdDTO dto = new QuestionStdDTO();
        dto.setIdQualificatif(1L);
        dto.setIntitule("Nouvelle Question");

        when(questionStdService.createStandardQuestion(any(QuestionStdDTO.class))).thenReturn(dto);

        mockMvc.perform(post("/api/questionsStd")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"idQualificatif\": 1, \"intitule\": \"Nouvelle Question\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.intitule").value("Nouvelle Question"));
    }

    /**
     * Test créer une question standard avec un qualificatif inexistant (POST)
     */
    @Test
    void testCreateStandardQuestionWithInvalidQualificatif() throws Exception {
        when(questionStdService.createStandardQuestion(any(QuestionStdDTO.class)))
                .thenThrow(new IllegalArgumentException("Le qualificatif spécifié n'existe pas."));

        mockMvc.perform(post("/api/questionsStd")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"idQualificatif\": 99, \"intitule\": \"Question invalide\"}"))
                .andExpect(status().isBadRequest());
    }

    /**
     * Test mettre à jour une question standard existante (PUT)
     */
    @Test
    void testUpdateStandardQuestion() throws Exception {
        QuestionStdDTO dto = new QuestionStdDTO();
        dto.setIdQualificatif(1L);
        dto.setIntitule("Question mise à jour");

        when(questionStdService.updateStandardQuestion(anyLong(), any(QuestionStdDTO.class))).thenReturn(dto);

        mockMvc.perform(put("/api/questionsStd/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"idQualificatif\": 1, \"intitule\": \"Question mise à jour\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.intitule").value("Question mise à jour"));
    }

    /**
     * Test mettre à jour une question standard inexistante (PUT)
     */
    @Test
    void testUpdateStandardQuestionNotFound() throws Exception {
        when(questionStdService.updateStandardQuestion(anyLong(), any(QuestionStdDTO.class)))
                .thenThrow(new IllegalArgumentException("Aucune question trouvée avec cet ID."));

        mockMvc.perform(put("/api/questionsStd/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"idQualificatif\": 1, \"intitule\": \"Question mise à jour\"}"))
                .andExpect(status().isNotFound());
    }

    /**
     * Test supprimer une question standard existante (DELETE)
     */
    @Test
    void testDeleteStandardQuestion() throws Exception {
        when(questionStdService.findById(anyLong())).thenReturn(Optional.of(new Question()));

        mockMvc.perform(delete("/api/questionsStd/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("La question a été supprimée avec succès."));
    }

    /**
     * Test supprimer une question standard inexistante (DELETE)
     */
    @Test
    void testDeleteStandardQuestionNotFound() throws Exception {
        when(questionStdService.findById(anyLong())).thenReturn(Optional.empty());

        mockMvc.perform(delete("/api/questionsStd/1"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Aucune question trouvée avec cet ID."));
    }
}
