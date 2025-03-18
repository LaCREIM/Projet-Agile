package com.example.backendagile.controllers;

import com.example.backendagile.dto.UniteEnseignementDTO;
import com.example.backendagile.services.UniteEnseignementService;
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
@WebMvcTest(UniteEnseignementController.class)
public class UniteEnseignementControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UniteEnseignementService uniteEnseignementService;

    private UniteEnseignementDTO ue1;
    private UniteEnseignementDTO ue2;

    @BeforeEach
   

    private static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testGetAllUnitesEnseignement() throws Exception {
        List<UniteEnseignementDTO> ues = Arrays.asList(ue1, ue2);
        when(uniteEnseignementService.getAllUnitesEnseignement()).thenReturn(ues);

        mockMvc.perform(get("/api/unites-enseignement"))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(ues)))
                .andDo(print());
    }

    @Test
    void testGetUnitesEnseignementByEnseignant() throws Exception {
        Long noEnseignant = 1L;
        List<UniteEnseignementDTO> ues = Arrays.asList(ue1, ue2);
        when(uniteEnseignementService.getUnitesEnseignementByPromotion(noEnseignant)).thenReturn(ues);

        mockMvc.perform(get("/api/unites-enseignement/enseignant/{noEnseignant}", noEnseignant))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(ues)))
                .andDo(print());
    }

    @Test
    void testGetUnitesEnseignementByEnseignant_EmptyList() throws Exception {
        Long noEnseignant = 2L;
        when(uniteEnseignementService.getUnitesEnseignementByPromotion(noEnseignant)).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/unites-enseignement/enseignant/{noEnseignant}", noEnseignant))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"))
                .andDo(print());
    }
}
