package com.example.backendagile.controllers;

import com.example.backendagile.dto.PromotionDTO;
import com.example.backendagile.entities.Promotion;
import com.example.backendagile.services.FormationService;
import com.example.backendagile.services.PromotionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PromotionControllerTest {

    @Mock
    private PromotionService promotionService;

    @Mock
    private FormationService formationService;

    @InjectMocks
    private PromotionController promotionController;

    private PromotionDTO promotionDTO;
    private Promotion promotion;

    @BeforeEach
    void setUp() {
        promotionDTO = new PromotionDTO();
        promotionDTO.setAnneeUniversitaire("2024-2024-2025");
        promotionDTO.setCodeFormation("M2DOSI");

        promotion = new Promotion();
    }

    @Test
    void getAllPromotions_ShouldReturnListOfPromotions() {
        when(promotionService.getAllPromotions()).thenReturn(Arrays.asList(promotionDTO));
        List<PromotionDTO> promotions = promotionController.getAllPromotions();
        assertEquals(1, promotions.size());
        verify(promotionService, times(1)).getAllPromotions();
    }

    @Test
    void getPromotionById_ShouldReturnPromotion_WhenExists() {
        when(promotionService.getPromotionById("2024-2025", "M2DOSI")).thenReturn(promotionDTO);
        PromotionDTO result = promotionController.getPromotionById("2024-2025", "M2DOSI");
        assertNotNull(result);
        assertEquals("2024-2025", result.getAnneeUniversitaire());
        assertEquals("M2DOSI", result.getCodeFormation());
    }

    @Test
    void createPromotion_ShouldReturnCreatedPromotion() {
        when(promotionService.createPromotion(promotionDTO)).thenReturn(promotion);
        ResponseEntity<Promotion> response = promotionController.createPromotion(promotionDTO);
        assertNotNull(response.getBody());
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void updatePromotion_ShouldReturnUpdatedPromotion() {
        when(promotionService.updatePromotion("2024-2025", "M2DOSI", promotionDTO)).thenReturn(promotionDTO);
        PromotionDTO result = promotionController.updatePromotion("2024-2025", "M2DOSI", promotionDTO);
        assertNotNull(result);
        assertEquals("2024-2025", result.getAnneeUniversitaire());
    }

    @Test
    void deletePromotion_ShouldReturnNoContent_WhenSuccessful() {
        doNothing().when(promotionService).deletePromotion("2024-2025", "M2DOSI");
        ResponseEntity<?> response = promotionController.deletePromotion("2024-2025", "M2DOSI");
        assertEquals(204, response.getStatusCodeValue());
    }
}
