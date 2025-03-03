package com.example.backendagile.controllers;

import com.example.backendagile.dto.PromotionDTO;
import com.example.backendagile.entities.Promotion;
import com.example.backendagile.services.PromotionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class PromotionControllerTest {
/* 
    @Mock
    private PromotionService promotionService;

    @InjectMocks
    private PromotionController promotionController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllPromotions() {
        List<PromotionDTO> promotions = Arrays.asList(new PromotionDTO(), new PromotionDTO());
        when(promotionService.getAllPromotions()).thenReturn(promotions);

        List<PromotionDTO> result = promotionController.getAllPromotions();

        assertEquals(promotions, result);
        verify(promotionService, times(2)).getAllPromotions();
    }

    @Test
    void testGetPromotionsByName() {
        String name = "TestName";
        List<PromotionDTO> promotions = Arrays.asList(new PromotionDTO(), new PromotionDTO());
        when(promotionService.getPromotionsByName(name)).thenReturn(promotions);

        List<PromotionDTO> result = promotionController.getPromotionsByName(name);

        assertEquals(promotions, result);
        verify(promotionService, times(1)).getPromotionsByName(name);
    }

    @Test
    void testGetPromotionById() {
        String anneeUniversitaire = "2023";
        String codeFormation = "CS101";
        PromotionDTO promotion = new PromotionDTO();
        when(promotionService.getPromotionById(anneeUniversitaire, codeFormation)).thenReturn(promotion);

        PromotionDTO result = promotionController.getPromotionById(anneeUniversitaire, codeFormation);

        assertEquals(promotion, result);
        verify(promotionService, times(1)).getPromotionById(anneeUniversitaire, codeFormation);
    }

    @Test
    void testCreatePromotion() {
        PromotionDTO promotionDTO = new PromotionDTO();
        Promotion promotion = new Promotion();
        when(promotionService.createPromotion(promotionDTO)).thenReturn(promotion);

        ResponseEntity<Promotion> response = promotionController.createPromotion(promotionDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(promotion, response.getBody());
        verify(promotionService, times(1)).createPromotion(promotionDTO);
    }

    @Test
    void testUpdatePromotion() {
        String anneeUniversitaire = "2023";
        String codeFormation = "CS101";
        PromotionDTO promotionDTO = new PromotionDTO();
        PromotionDTO updatedPromotion = new PromotionDTO();

        when(promotionService.updatePromotion(anneeUniversitaire, codeFormation, promotionDTO)).thenReturn(updatedPromotion);

        ResponseEntity<String> response = promotionController.updatePromotion(anneeUniversitaire, codeFormation, promotionDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Promotion mise à jour avec succès", response.getBody());
        verify(promotionService, times(1)).updatePromotion(anneeUniversitaire, codeFormation, promotionDTO);
    }

    @Test
    void testDeletePromotion() {
        String anneeUniversitaire = "2023";
        String codeFormation = "CS101";

        ResponseEntity<?> response = promotionController.deletePromotion(anneeUniversitaire, codeFormation);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(promotionService, times(1)).deletePromotion(anneeUniversitaire, codeFormation);
    }

    @Test
    void testGetAllPromotionPaged() {
        int page = 0;
        int size = 10;
        List<PromotionDTO> promotions = Arrays.asList(new PromotionDTO(), new PromotionDTO());
        when(promotionService.getPromotionPaged(page, size)).thenReturn(promotions);

        List<PromotionDTO> result = promotionController.getAllPromotionPaged(page, size);

        assertEquals(promotions, result);
        verify(promotionService, times(1)).getPromotionPaged(page, size);
    }*/
}