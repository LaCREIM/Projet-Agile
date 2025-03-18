package com.example.backendagile.controllers;

import com.example.backendagile.dto.QuestionPrsDTO;
import com.example.backendagile.dto.RubriqueQuestionPrsDTO;
import com.example.backendagile.services.RubriqueQuestionPrsService;
import com.fasterxml.jackson.databind.ObjectMapper;
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

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@ExtendWith(SpringExtension.class)
@WebMvcTest(RubriqueQuestionPrsController.class)
public class RubriqueQuestionPrsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RubriqueQuestionPrsService rubriqueQuestionPrsService;

    private RubriqueQuestionPrsDTO rubriqueQuestionPrsDTO;

    @BeforeEach
    void setUp() {
        QuestionPrsDTO questionPrsDTO = new QuestionPrsDTO();
        questionPrsDTO.setIdQuestion(1L);
        questionPrsDTO.setIntitule("Question Test");

        rubriqueQuestionPrsDTO = new RubriqueQuestionPrsDTO(1L, "Rubrique Test", questionPrsDTO, 1L);
    }

    private static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testGetRubriquesByEnseignant() throws Exception {
        List<RubriqueQuestionPrsDTO> rubriques = Arrays.asList(rubriqueQuestionPrsDTO);
        when(rubriqueQuestionPrsService.getRubriquesQuestionByEnseignant(1L)).thenReturn(rubriques);

        mockMvc.perform(get("/api/rubrique-questions/personnelle/enseignant/1"))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(rubriques)))
                .andDo(print());
    }

    @Test
    void testSaveOrUpdateRubriqueQuestions() throws Exception {
        doNothing().when(rubriqueQuestionPrsService).saveOrUpdateRubriqueQuestions(anyList());

        mockMvc.perform(post("/api/rubrique-questions/personnelle/sauvgarder")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(Arrays.asList(rubriqueQuestionPrsDTO))))
                .andExpect(status().isNoContent())
                .andDo(print());
    }

    @Test
    void testDeleteRubriqueQuestion_Success() throws Exception {
        doNothing().when(rubriqueQuestionPrsService).deleteRubriqueQuestion(1L, 1L);

        mockMvc.perform(delete("/api/rubrique-questions/personnelle/1/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Rubrique Question Standard supprimée avec succès."))
                .andDo(print());
    }

    @Test
    void testDeleteRubriqueQuestion_NotFound() throws Exception {
        doThrow(new IllegalArgumentException("Rubrique ou Question non trouvée")).when(rubriqueQuestionPrsService).deleteRubriqueQuestion(1L, 1L);

        mockMvc.perform(delete("/api/rubrique-questions/personnelle/1/1"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Rubrique ou Question non trouvée"))
                .andDo(print());
    }

    @Test
    void testDeleteRubriqueQuestion_ServerError() throws Exception {
        doThrow(new RuntimeException("Unexpected error")).when(rubriqueQuestionPrsService).deleteRubriqueQuestion(1L, 1L);

        mockMvc.perform(delete("/api/rubrique-questions/personnelle/1/1"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Une erreur inattendue est survenue lors de la suppression."))
                .andDo(print());
    }

    @Test
    void testGetQuestionsByRubrique_Success() throws Exception {
        List<RubriqueQuestionPrsDTO> questions = Arrays.asList(rubriqueQuestionPrsDTO);
        when(rubriqueQuestionPrsService.getQuestionsByRubrique(1L)).thenReturn(questions);

        mockMvc.perform(get("/api/rubrique-questions/personnelle/1"))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(questions)))
                .andDo(print());
    }

    @Test
    void testGetQuestionsByRubrique_NotFound() throws Exception {
        when(rubriqueQuestionPrsService.getQuestionsByRubrique(1L)).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/rubrique-questions/personnelle/1"))
                .andExpect(status().isNotFound())
                .andExpect(content().json(asJsonString(Collections.singletonMap("message", "Aucune question standard trouvée pour cette rubrique."))))
                .andDo(print());
    }

    @Test
    void testGetQuestionsByRubrique_ServerError() throws Exception {
        doThrow(new RuntimeException("Unexpected error")).when(rubriqueQuestionPrsService).getQuestionsByRubrique(1L);

        mockMvc.perform(get("/api/rubrique-questions/personnelle/1"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().json(asJsonString(Collections.singletonMap("error", "Une erreur est survenue."))))
                .andDo(print());
    }
}
