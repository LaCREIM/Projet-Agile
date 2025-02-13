package com.example.backendagile.controllers;

import com.example.backendagile.dto.QuestionPrsDTO;
import com.example.backendagile.services.QuestionPrsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class QuestionPrsControllerTest {

    private MockMvc mockMvc;

    @Mock
    private QuestionPrsService questionPrsService;

    @InjectMocks
    private QuestionPrsController questionPrsController;

    @BeforeEach
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(questionPrsController).build();
    }

    @Test
    public void testGetAllQuestions() throws Exception {
        QuestionPrsDTO question1 = new QuestionPrsDTO("Contenu", 1L, 1L);
        QuestionPrsDTO question2 = new QuestionPrsDTO("Interet", 2L, 2L);
        when(questionPrsService.getAllQuestions()).thenReturn(Arrays.asList(question1, question2));

        mockMvc.perform(get("/api/questionsPrs"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].intitule").value("Contenu"))
                .andExpect(jsonPath("$[1].intitule").value("Interet"));
    }

    @Test
    public void testGetQuestionById() throws Exception {
        QuestionPrsDTO question = new QuestionPrsDTO("Contenu", 1L, 1L);
        when(questionPrsService.getQuestionById(1L)).thenReturn(Optional.of(question));

        mockMvc.perform(get("/api/questionsPrs/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.intitule").value("Contenu"));
    }

    @Test
    public void testGetQuestionByIdNotFound() throws Exception {
        when(questionPrsService.getQuestionById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/questionsPrs/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testCreateQuestion() throws Exception {
        QuestionPrsDTO question = new QuestionPrsDTO("Interet", 2L, 2L);
        when(questionPrsService.saveQuestion(any(QuestionPrsDTO.class))).thenReturn(question);

        mockMvc.perform(post("/api/questionsPrs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"intitule\":\"Interet\",\"idQuestion\":2,\"idQualificatif\":2}")
                )
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.intitule").value("Interet"));
    }

    @Test
    public void testUpdateQuestion() throws Exception {
        QuestionPrsDTO updatedQuestion = new QuestionPrsDTO("Interet modifié", 2L, 2L);
        when(questionPrsService.updateQuestion(eq(2L), any(QuestionPrsDTO.class))).thenReturn(updatedQuestion);

        mockMvc.perform(put("/api/questionsPrs/2")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"intitule\":\"Interet modifié\",\"idQuestion\":2,\"idQualificatif\":2}")
                )
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.intitule").value("Interet modifié"));
    }

    @Test
    public void testDeleteQuestion() throws Exception {
        doNothing().when(questionPrsService).deleteQuestion(2L);

        mockMvc.perform(delete("/api/questionsPrs/2"))
                .andExpect(status().isNoContent());

        verify(questionPrsService, times(1)).deleteQuestion(2L);
    }

    @Test
    public void testGetQuestionsByEnseignant() throws Exception {
        QuestionPrsDTO question1 = new QuestionPrsDTO("Contenu", 1L, 1L);
        QuestionPrsDTO question2 = new QuestionPrsDTO("Interet", 2L, 2L);
        when(questionPrsService.getQuestionsByEnseignant(123L)).thenReturn(Arrays.asList(question1, question2));

        mockMvc.perform(get("/api/questionsPrs/enseignant/123"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].intitule").value("Contenu"))
                .andExpect(jsonPath("$[1].intitule").value("Interet"));
    }
}
