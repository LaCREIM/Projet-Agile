package com.example.backendagile.controllers;

import com.example.backendagile.dto.RubriqueDTO;
import com.example.backendagile.services.RubriqueService;
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

import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@ExtendWith(SpringExtension.class)
@WebMvcTest(RubriqueController.class)
public class RubriqueControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RubriqueService rubriqueService;

    private RubriqueDTO rubrique1;
    private RubriqueDTO rubrique2;

    @BeforeEach
   
    private static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testGetRubriques() throws Exception {
        List<RubriqueDTO> rubriques = Arrays.asList(rubrique1, rubrique2);
        when(rubriqueService.getRubriques()).thenReturn(rubriques);

        mockMvc.perform(get("/api/rubriques"))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(rubriques)))
                .andDo(print());
    }

    @Test
    void testGetRubriquesByEnseignantPaged() throws Exception {
        Long enseignantId = 1L;
        List<RubriqueDTO> rubriques = Arrays.asList(rubrique1, rubrique2);
        when(rubriqueService.getRubriquesPaged(enseignantId, 0, 10)).thenReturn(rubriques);

        mockMvc.perform(get("/api/rubriques/paged/enseignants/{enseignantId}?page=0&size=10", enseignantId))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(rubriques)))
                .andDo(print());
    }

    @Test
    void testGetRubriquesByEnseignant() throws Exception {
        Long enseignantId = 1L;
        List<RubriqueDTO> rubriques = Arrays.asList(rubrique1, rubrique2);
        when(rubriqueService.getRubriques(enseignantId)).thenReturn(rubriques);

        mockMvc.perform(get("/api/rubriques/enseignants/{enseignantId}", enseignantId))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(rubriques)))
                .andDo(print());
    }

    @Test
    void testCreateRubrique() throws Exception {
        when(rubriqueService.createRubrique(any(RubriqueDTO.class))).thenReturn(rubrique1);

        mockMvc.perform(post("/api/rubriques")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(rubrique1)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idRubrique").value(rubrique1.getId()))
                .andExpect(jsonPath("$.designation").value(rubrique1.getDesignation()))
                .andDo(print());
    }
}
