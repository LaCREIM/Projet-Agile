package com.example.backendagile.controllers;

import com.example.backendagile.dto.PromotionDTO;
import com.example.backendagile.entities.Promotion;
import com.example.backendagile.services.FormationService;
import com.example.backendagile.services.PromotionService;
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

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@ExtendWith(SpringExtension.class)
@WebMvcTest(PromotionController.class)
public class PromotionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PromotionService promotionService;

    @MockBean
    private FormationService formationService;

    private PromotionDTO promotionDTO;

    @BeforeEach
    void setUp() {
        promotionDTO = new PromotionDTO();
        promotionDTO.setAnneeUniversitaire("2024-2025");
        promotionDTO.setSiglePromotion("SIGLE1");
        promotionDTO.setNbMaxEtudiant((short) 30);
        promotionDTO.setDateReponseLp(LocalDate.now().plusDays(5));
        promotionDTO.setDateReponseLalp(LocalDate.now().plusDays(10));
        promotionDTO.setDateRentree(LocalDate.now().plusMonths(1));
        promotionDTO.setLieuRentree("Campus");
        promotionDTO.setProcessusStage("STAGE");
        promotionDTO.setCommentaire("Commentaire test");
        promotionDTO.setCodeFormation("M2DOSI");
        promotionDTO.setNomFormation("Master Informatique");
        promotionDTO.setEmailEnseignant("prof@test.com");
        promotionDTO.setDiplome("Master");
        promotionDTO.setNoEnseignant(123L);
        promotionDTO.setNom("Dupont");
        promotionDTO.setPrenom("Jean");
    }

    private static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testGetAllPromotions() throws Exception {
        List<PromotionDTO> promotions = Arrays.asList(promotionDTO);
        when(promotionService.getAllPromotions()).thenReturn(promotions);

        mockMvc.perform(get("/api/promotions"))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(promotions)))
                .andDo(print());
    }

    @Test
    void testGetPromotionById() throws Exception {
        when(promotionService.getPromotionById("2024-2025", "M2DOSI")).thenReturn(promotionDTO);

        mockMvc.perform(get("/api/promotions/2024-2025/M2DOSI"))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(promotionDTO)))
                .andDo(print());
    }

    @Test
    void testCreatePromotion_Success() throws Exception {
        when(promotionService.getPromotionById(anyString(), anyString())).thenReturn(null);
        doNothing().when(promotionService).createPromotion(any(PromotionDTO.class));

        mockMvc.perform(post("/api/promotions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(promotionDTO)))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(Map.of("message", "Promotion créée avec succès"))))
                .andDo(print());
    }

    @Test
    void testCreatePromotion_AlreadyExists() throws Exception {
        when(promotionService.getPromotionById(anyString(), anyString())).thenReturn(promotionDTO);

        mockMvc.perform(post("/api/promotions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(promotionDTO)))
                .andExpect(status().isConflict())
                .andExpect(content().json(asJsonString(Map.of("error", "La promotion existe déjà"))))
                .andDo(print());
    }

    @Test
    void testUpdatePromotion() throws Exception {
        doNothing().when(promotionService).updatePromotion(anyString(), anyString(), any(PromotionDTO.class));

        mockMvc.perform(put("/api/promotions/2024-2025/M2DOSI")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(promotionDTO)))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(Map.of("message", "Promotion mise à jour avec succès"))))
                .andDo(print());
    }

    @Test
    void testDeletePromotion_Success() throws Exception {
        doNothing().when(promotionService).deletePromotion(anyString(), anyString());

        mockMvc.perform(delete("/api/promotions/2024-2025/M2DOSI"))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(Map.of("message", "La promotion a été supprimée avec succès."))))
                .andDo(print());
    }

    @Test
    void testDeletePromotion_Conflict() throws Exception {
        doThrow(new RuntimeException("Cette promotion ne peut pas être supprimée car elle contient des étudiants."))
                .when(promotionService).deletePromotion(anyString(), anyString());

        mockMvc.perform(delete("/api/promotions/2024-2025/M2DOSI"))
                .andExpect(status().isConflict())
                .andExpect(content().json(asJsonString(Map.of("error", "Cette promotion ne peut pas être supprimée car elle contient des étudiants."))))
                .andDo(print());
    }

    @Test
    void testGetPromotionsByEnseignantForEvaluation() throws Exception {
        List<PromotionDTO> promotions = Arrays.asList(promotionDTO);
        when(promotionService.getPromotionsByEnseignantForEvaluation(anyLong())).thenReturn(promotions);

        mockMvc.perform(get("/api/promotions/enseignant/123"))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(promotions)))
                .andDo(print());
    }

    @Test
    void testSearchPromotions() throws Exception {
        List<Promotion> promotions = Collections.singletonList(new Promotion());
        when(promotionService.searchPromotions("M2DOSI")).thenReturn(promotions);

        mockMvc.perform(get("/api/promotions/search?keyword=M2DOSI"))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(promotions)))
                .andDo(print());
    }

    @Test
    void testGetAllPromotionPaged() throws Exception {
        List<PromotionDTO> promotions = Arrays.asList(promotionDTO);
        when(promotionService.getPromotionPaged(anyInt(), anyInt())).thenReturn(promotions);

        mockMvc.perform(get("/api/promotions/paged?page=0&size=5"))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(promotions)))
                .andDo(print());
    }
}
