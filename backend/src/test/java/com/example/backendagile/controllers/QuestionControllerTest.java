package com.example.backendagile.controllers;

import com.example.backendagile.dto.QuestionDTO;
import com.example.backendagile.entities.Question;
import com.example.backendagile.services.QuestionService;
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
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@ExtendWith(SpringExtension.class)
@WebMvcTest(QuestionController.class)
public class QuestionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private QuestionService questionService;

    private QuestionDTO questionDTO;

    @BeforeEach

    private static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testGetAllQuestions() throws Exception {
        List<QuestionDTO> questions = Arrays.asList(questionDTO);
        when(questionService.getAllQuestions()).thenReturn(questions);

        mockMvc.perform(get("/api/questions"))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(questions)))
                .andDo(print());
    }

    @Test
    void testGetQuestionById_Success() throws Exception {
        when(questionService.getQuestionById(1L)).thenReturn(Optional.of(questionDTO));

        mockMvc.perform(get("/api/questions/1"))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(questionDTO)))
                .andDo(print());
    }

    @Test
    void testGetQuestionById_NotFound() throws Exception {
        when(questionService.getQuestionById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/questions/1"))
                .andExpect(status().isNotFound())
                .andExpect(status().reason("Question Not Found"))
                .andDo(print());
    }

    @Test
    void testCreateQuestion() throws Exception {
        when(questionService.saveQuestion(any(QuestionDTO.class))).thenReturn(questionDTO);

        mockMvc.perform(post("/api/questions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(questionDTO)))
                .andExpect(status().isCreated())
                .andExpect(content().json(asJsonString(questionDTO)))
                .andDo(print());
    }

    @Test
    void testUpdateQuestion() throws Exception {
        when(questionService.updateQuestion(eq(1L), any(QuestionDTO.class))).thenReturn(questionDTO);

        mockMvc.perform(put("/api/questions/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(questionDTO)))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(questionDTO)))
                .andDo(print());
    }

    @Test
    void testDeleteQuestion() throws Exception {
        doNothing().when(questionService).deleteQuestion(1L);

        mockMvc.perform(delete("/api/questions/1"))
                .andExpect(status().isNoContent())
                .andDo(print());
    }

    @Test
    void testGetQuestionsByEnseignant() throws Exception {
        List<QuestionDTO> questions = Arrays.asList(questionDTO);
        when(questionService.getQuestionsByEnseignant(1L)).thenReturn(questions);

        mockMvc.perform(get("/api/questions/enseignant/1"))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(questions)))
                .andDo(print());
    }

    @Test
    void testSearchQuestionsPaged() throws Exception {
        List<Question> questions = Arrays.asList(new Question());
        when(questionService.searchQuestionsPaged(1L, "test", 0, 10)).thenReturn(questions);

        mockMvc.perform(get("/api/questions/search")
                .param("noEnseignant", "1")
                .param("keyword", "test")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(questions)))
                .andDo(print());
    }

    @Test
    void testGetSearchTotalPages() throws Exception {
        when(questionService.getSearchTotalPages(1L, "test", 10)).thenReturn(5);

        mockMvc.perform(get("/api/questions/search/total-pages")
                .param("noEnseignant", "1")
                .param("keyword", "test")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(content().string("5"))
                .andDo(print());
    }

    @Test
    void testGetQuestionsPaged() throws Exception {
        List<Question> questions = Arrays.asList(new Question());
        when(questionService.getQuestionsPaged(1L, 0, 10)).thenReturn(questions);

        mockMvc.perform(get("/api/questions/paged")
                .param("noEnseignant", "1")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(questions)))
                .andDo(print());
    }

    @Test
    void testGetTotalPages() throws Exception {
        when(questionService.getTotalPages(1L, 10)).thenReturn(5);

        mockMvc.perform(get("/api/questions/total-pages")
                .param("noEnseignant", "1")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(content().string("5"))
                .andDo(print());
    }

    @Test
    void testExistsQuestionInEvaluation() throws Exception {
        when(questionService.existsQuestionInEvaluation(1L)).thenReturn(true);

        mockMvc.perform(get("/api/questions/exists/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"))
                .andDo(print());
    }

    @Test
    void testGetQuestionsStdAndPerso() throws Exception {
        List<QuestionDTO> questions = Arrays.asList(questionDTO);
        when(questionService.getQuestionsStdAndPerso(1L)).thenReturn(questions);

        mockMvc.perform(get("/api/questions/std-prs/1"))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(questions)))
                .andDo(print());
    }
}
