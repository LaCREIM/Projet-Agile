package com.example.backendagile.controllers;

import com.example.backendagile.dto.PromotionDTO;
import com.example.backendagile.entities.Promotion;
import com.example.backendagile.mapper.PromotionMapper;
import com.example.backendagile.repositories.FormationRepository;
import com.example.backendagile.services.EnseignantService;
import com.example.backendagile.services.PromotionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Optional;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

public class PromotionControllerTest {

    private MockMvc mockMvc;

    @Mock
    private PromotionService promotionService;

    @InjectMocks
    private PromotionController promotionController;

    private PromotionMapper promotionMapper;
    @BeforeEach
    public void setUp() {
        promotionMapper = new PromotionMapper(new EnseignantService(), null);
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(promotionController).build();
    }

    /**
     * Test : Get all promotions with pagination
     */
    @Test
    public void testGetAllPromotionsWithPagination() throws Exception {

        Long ens1 = 1L;
        System.out.println("avhbbbbbbbbbbbbbbbbbb");

        PromotionDTO promotion1 = new PromotionDTO("2013-2014", "DOSI4", (short) 24,
                LocalDate.parse("2013-05-04"), LocalDate.parse("2013-05-19"), LocalDate.parse("2013-09-07"),
                "LC117B", "EC", null, "M2DOSI", "Master Developpement e lOffshore des Systemes dInformation",
                "philippe.saliou@univ-brest.fr", "M", ens1, "MCF", "Saliou", "Philippe");

        PromotionDTO promotion2 = new PromotionDTO("2014-2015", "DOSI5", (short) 24,
                LocalDate.parse("2014-05-10"), LocalDate.parse("2014-05-19"), LocalDate.parse("2014-09-08"),
                "LC117B", "RECH", null, "M2DOSI", "Master Developpement e lOffshore des Systemes dInformation",
                "philippe.saliou@univ-brest.fr", "M", ens1, "MCF", "Saliou", "Philippe");

        Mockito.when(promotionService.getAllPromotions())
                .thenAnswer(invocation -> {
                    // Log the promotions to the console
                    System.out.println("Returning promotions:");
                    System.out.println(promotion1);
                    System.out.println(promotion2);
                    return Arrays.asList(promotion1, promotion2);
                });

        mockMvc.perform(MockMvcRequestBuilders.get("/api/promotions")).andDo(print())

                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].siglePromotion").value("DOSI4"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].siglePromotion").value("DOSI5"));
    }

    /**
     * Test : Get promotion by ID
     */
    @Test
    public void testGetPromotionById() throws Exception {
        PromotionDTO promotion = new PromotionDTO("2013-2014", "DOSI4", (short) 24,
                LocalDate.parse("2013-05-04"), LocalDate.parse("2013-05-19"), LocalDate.parse("2013-09-07"),
                "LC117B", "EC", null, "M2DOSI", "Master Developpement e lOffshore des Systemes dInformation",
                "philippe.saliou@univ-brest.fr", "M", 1L, "MCF", "Saliou", "Philippe");

        // Mock the service method to return the promotion when given "2013-2014" and "DOSI4"
        Mockito.when(promotionService.getPromotionById("2013-2014", "M2DOSI"))
                .thenReturn(promotion);

        // Perform the request using the two parameters
        mockMvc.perform(MockMvcRequestBuilders.get("/api/promotions/2013-2014/M2DOSI")
                ).andDo(print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.siglePromotion").value("DOSI4"));
    }


    /**
     * Test : Create a new promotion
     */
    @Test
    public void testCreatePromotion() throws Exception {
        PromotionDTO promotion = new PromotionDTO(
                "2013-2014", "DOSI4", (short) 24, LocalDate.parse("2013-05-04"), LocalDate.parse("2013-05-19"),
                LocalDate.parse("2013-09-07"), "LC117B", "EC", null, "M2DOSI",
                "Master Developpement e lOffshore des Systemes dInformation",
                "philippe.saliou@univ-brest.fr", "M", 1L, "MCF", "Saliou", "Philippe"
        );
        Promotion prm = promotionMapper.fromPromotionDTO(promotion);
        Mockito.when(promotionService.createPromotion(ArgumentMatchers.any(PromotionDTO.class)))
                .thenReturn(prm);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/promotions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"anneeUniversitaire\": \"2013-2014\", \"siglePromotion\": \"DOSI4\", \"nbMaxEtudiant\": 24, \"dateReponseLp\": \"2013-05-04\", \"dateReponseLalp\": \"2013-05-19\", \"dateRentree\": \"2013-09-07\", \"lieuRentree\": \"LC117B\", \"processusStage\": \"EC\", \"codeFormation\": \"M2DOSI\"}"))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.content().string("Promotion created successfully."));
    }

    /**
     * Test : Update an existing promotion
     */
    @Test
    public void testUpdatePromotion() throws Exception {
        PromotionDTO promotion = new PromotionDTO("2013-2014", "DOSI4", (short) 24, LocalDate.parse("2013-05-04"), LocalDate.parse("2013-05-19"), LocalDate.parse("2013-09-07"), "LC117B", "EC", null, "M2DOSI", "Master Developpement e lOffshore des Systemes dInformation", "philippe.saliou@univ-brest.fr", "M", 1L, "MCF", "Saliou", "Philippe");

        Mockito.when(promotionService.getPromotionById("2013-2014", "DOSI4"))
                .thenReturn(promotion);
        Mockito.when(promotionService.updatePromotion("2013-2014", "DOSI4", promotion))
                .thenReturn(promotion);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/promotions/2013-2014")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"siglePromotion\": \"DOSI4 Updated\"}"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("Promotion updated successfully."));
    }

    /**
     * Test : Delete promotion by ID
     */
//    @Test
//    public void testDeletePromotion() throws Exception {
//        PromotionDTO promotion = new PromotionDTO("2013-2014", "DOSI4", (short) 24, LocalDate.parse("2013-05-04"), LocalDate.parse("2013-05-19"), LocalDate.parse("2013-09-07"), "LC117B", "EC", null, "M2DOSI", "Master Developpement e lOffshore des Systemes dInformation", "philippe.saliou@univ-brest.fr", "M", 1L, "MCF", "Saliou", "Philippe");
//
//        Mockito.when(promotionService.findById(ArgumentMatchers.anyString()))
//                .thenReturn(Optional.of(promotion));
//        Mockito.doNothing().when(promotionService).deleteById(ArgumentMatchers.anyString());
//
//        mockMvc.perform(MockMvcRequestBuilders.delete("/api/promotions/2013-2014"))
//                .andExpect(MockMvcResultMatchers.status().isOk());
//    }
}
