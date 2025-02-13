package com.example.backendagile.controllers;

import com.example.backendagile.dto.QuestionStdDTO;
import com.example.backendagile.entities.Question;
import com.example.backendagile.entities.Qualificatif;
import com.example.backendagile.services.QuestionStdService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(QuestionStdController.class)
public class QuestionStdControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private QuestionStdService questionStdService;

    @Autowired
    private ObjectMapper objectMapper;

    private QuestionStdDTO questionStdDTO;
    private Question question;
    private Qualificatif qualificatif;

    @BeforeEach
    void setUp() {
        qualificatif = new Qualificatif();
        qualificatif.setId(1L);
        qualificatif.setMaximal("Excellent");
        qualificatif.setMinimal("Mauvais");

        question = new Question();
        question.setId(1L);
        question.setIdQualificatif(qualificatif);
        question.setIntitule("Quel est votre avis sur ce cours ?");

        questionStdDTO = new QuestionStdDTO();
        questionStdDTO.setIdQualificatif(1L);
        questionStdDTO.setIntitule("Quel est votre avis sur ce cours ?");
    }

    /**
     * ✅ Test : Récupération de toutes les questions standards
     */
    @Test
    void testGetStandardQuestions() throws Exception {
        when(questionStdService.getStandardQuestions()).thenReturn(List.of(question));

        mockMvc.perform(get("/api/questionsStd"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(1)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].intitule", is("Quel est votre avis sur ce cours ?")));
    }

    /**
     * ✅ Test : Récupération d’une question standard par ID (Success)
     */
    @Test
    void testGetQuestionByIdSuccess() throws Exception {
        when(questionStdService.findById(1L)).thenReturn(Optional.of(question));

        mockMvc.perform(get("/api/questionsStd/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.intitule", is("Quel est votre avis sur ce cours ?")));
    }

    /**
     * ❌ Test : Récupération d’une question standard par ID (Not Found)
     */
    @Test
    void testGetQuestionByIdNotFound() throws Exception {
        when(questionStdService.findById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/questionsStd/99"))
                .andExpect(status().isNotFound());
    }

    /**
     * ✅ Test : Création d’une question standard (Success)
     */
    @Test
    void testCreateStandardQuestion() throws Exception {
        when(questionStdService.createStandardQuestion(any(QuestionStdDTO.class))).thenReturn(questionStdDTO);

        mockMvc.perform(post("/api/questionsStd")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(questionStdDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.intitule", is("Quel est votre avis sur ce cours ?")));
    }

    /**
     * ❌ Test : Création d’une question standard avec un qualificatif inexistant (Bad Request)
     */
    @Test
    void testCreateStandardQuestionWithInvalidQualificatif() throws Exception {
        when(questionStdService.createStandardQuestion(any(QuestionStdDTO.class)))
                .thenThrow(new IllegalArgumentException("Le qualificatif spécifié n'existe pas."));

        mockMvc.perform(post("/api/questionsStd")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(questionStdDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Le qualificatif spécifié n'existe pas."));
    }

    /**
     * ✅ Test : Mise à jour d’une question standard (Success)
     */
    @Test
    void testUpdateStandardQuestion() throws Exception {
        when(questionStdService.updateStandardQuestion(eq(1L), any(QuestionStdDTO.class))).thenReturn(question);

        mockMvc.perform(put("/api/questionsStd/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(questionStdDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.intitule", is("Quel est votre avis sur ce cours ?")));
    }

    /**
     * ❌ Test : Mise à jour d’une question standard inexistante (Not Found)
     */
    @Test
    void testUpdateStandardQuestionNotFound() throws Exception {
        when(questionStdService.updateStandardQuestion(eq(99L), any(QuestionStdDTO.class)))
                .thenThrow(new IllegalArgumentException("Aucune question trouvée avec cet ID."));

        mockMvc.perform(put("/api/questionsStd/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(questionStdDTO)))
                .andExpect(status().isNotFound());
    }

    /**
     * ✅ Test : Suppression d’une question standard (Success)
     */
    @Test
    void testDeleteStandardQuestion() throws Exception {
        when(questionStdService.findById(1L)).thenReturn(Optional.of(question));
        Mockito.doNothing().when(questionStdService).deleteById(1L);

        mockMvc.perform(delete("/api/questionsStd/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("La question a été supprimée avec succès."));
    }

    /**
     * ❌ Test : Suppression d’une question standard inexistante (Not Found)
     */
    @Test
    void testDeleteStandardQuestionNotFound() throws Exception {
        when(questionStdService.findById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(delete("/api/questionsStd/99"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Aucune question trouvée avec cet ID."));
    }
}
