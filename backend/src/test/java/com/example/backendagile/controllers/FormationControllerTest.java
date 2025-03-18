package com.example.backendagile.controllers;

import com.example.backendagile.entities.Formation;
import com.example.backendagile.services.FormationService;
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
@WebMvcTest(FormationController.class)
public class FormationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FormationService formationService;

    private Formation formation1;
    private Formation formation2;

    @BeforeEach
    void setUp() {
        formation1 = new Formation();
        formation1.setCodeFormation("M2DOSI");
        formation1.setNomFormation("Master Développement Offshore");

        formation2 = new Formation();
        formation2.setCodeFormation("M1INFO");
        formation2.setNomFormation("Master Informatique");
    }

    private static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testGetAllFormations() throws Exception {
        List<Formation> formations = Arrays.asList(formation1, formation2);
        when(formationService.getAllFormations()).thenReturn(formations);

        mockMvc.perform(get("/api/formations"))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(formations)))
                .andDo(print());
    }
}
