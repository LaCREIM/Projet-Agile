package com.example.backendagile.controllers;

import com.example.backendagile.dto.RubriqueStdDTO;
import com.example.backendagile.entities.Rubrique;
import com.example.backendagile.services.RubriqueStdService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RubriqueStdController.class)
public class RubriqueStdControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RubriqueStdService rubriqueStdService;

    private Rubrique rubrique;
    private RubriqueStdDTO rubriqueStdDTO;

    @BeforeEach
    void setUp() {
        rubrique = new Rubrique();
        rubrique.setId(1L);
        rubrique.setDesignation("Rubrique Test");
        rubrique.setType("RBS");  // Type standard

        rubriqueStdDTO = new RubriqueStdDTO();
        rubriqueStdDTO.setDesignation("Nouvelle Rubrique");
    }

    /**
     * Test de récupération de toutes les rubriques standards
     */
    @Test
    void testGetStandardRubriques() throws Exception {
        Mockito.when(rubriqueStdService.getStandardRubriques()).thenReturn(Arrays.asList(rubrique));

        mockMvc.perform(get("/api/rubriquesStd"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(rubrique.getId()))
                .andExpect(jsonPath("$[0].designation").value(rubrique.getDesignation()));
    }

    /**
     * Test de récupération d'une rubrique par ID (existe)
     */
    @Test
    void testGetRubriqueById() throws Exception {
        Mockito.when(rubriqueStdService.findById(1L)).thenReturn(Optional.of(rubrique));

        mockMvc.perform(get("/api/rubriquesStd/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(rubrique.getId()))
                .andExpect(jsonPath("$.designation").value(rubrique.getDesignation()));
    }

    /**
     * Test de récupération d'une rubrique par ID (non trouvée)
     */
    @Test
    void testGetRubriqueById_NotFound() throws Exception {
        Mockito.when(rubriqueStdService.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/rubriquesStd/1"))
                .andExpect(status().isNotFound());
    }

    /**
     * Test de création d'une rubrique standard
     */
    @Test
    void testCreateStandardRubrique() throws Exception {
        Mockito.when(rubriqueStdService.createStandardRubrique(any(RubriqueStdDTO.class)))
                .thenReturn(rubriqueStdDTO);

        mockMvc.perform(post("/api/rubriquesStd")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"designation\": \"Nouvelle Rubrique\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.designation").value(rubriqueStdDTO.getDesignation()));
    }

    /**
     * Test de mise à jour d'une rubrique standard
     */
    @Test
    void testUpdateStandardRubrique() throws Exception {
        Mockito.when(rubriqueStdService.findById(anyLong())).thenReturn(Optional.of(rubrique));
        Mockito.when(rubriqueStdService.updateStandardRubrique(anyLong(), any()))
                .thenReturn(rubrique);

        mockMvc.perform(put("/api/rubriquesStd/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"designation\": \"Nouvelle Désignation\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.designation").value("Rubrique Test"));  // Vérifie l'ancienne valeur car updateStandardRubrique retourne l'entité existante
    }

    /**
     * Test de mise à jour d'une rubrique standard (ID non trouvé)
     */
    @Test
    void testUpdateStandardRubrique_NotFound() throws Exception {
        Mockito.when(rubriqueStdService.findById(anyLong())).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/rubriquesStd/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"designation\": \"Nouvelle Désignation\"}"))
                .andExpect(status().isNotFound());
    }

    /**
     * Test de suppression d'une rubrique standard
     */
    @Test
    void testDeleteRubrique() throws Exception {
        Mockito.when(rubriqueStdService.findById(anyLong())).thenReturn(Optional.of(rubrique));
        Mockito.doNothing().when(rubriqueStdService).deleteById(anyLong());

        mockMvc.perform(delete("/api/rubriquesStd/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("La rubrique a été supprimée avec succès."));
    }

    /**
     * Test de suppression d'une rubrique standard (non trouvée)
     */
    @Test
    void testDeleteRubrique_NotFound() throws Exception {
        Mockito.when(rubriqueStdService.findById(anyLong())).thenReturn(Optional.empty());

        mockMvc.perform(delete("/api/rubriquesStd/1"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Aucune rubrique trouvée avec cet ID."));
    }

    /**
     * Test de suppression d'une rubrique standard (déjà utilisée)
     */
    @Test
    void testDeleteRubrique_Conflict() throws Exception {
        Mockito.when(rubriqueStdService.findById(anyLong())).thenReturn(Optional.of(rubrique));
        Mockito.doThrow(new RuntimeException("La rubrique est déjà utilisée.")).when(rubriqueStdService).deleteById(anyLong());

        mockMvc.perform(delete("/api/rubriquesStd/1"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("La rubrique est déjà utilisée."));
    }
}
