package com.example.backendagile.controllers;

import com.example.backendagile.dto.DroitDTO;
import com.example.backendagile.entities.Droit;
import com.example.backendagile.entities.DroitId;
import com.example.backendagile.services.DroitService;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import com.fasterxml.jackson.databind.ObjectMapper;

@ExtendWith(SpringExtension.class)
@WebMvcTest(DroitController.class)
public class DroitControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DroitService droitService;

    private DroitDTO droitDTO;
    private Droit droit;


    private static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testGetDroitsByEvaluation() throws Exception {
        List<DroitDTO> droits = Arrays.asList(droitDTO);

        when(droitService.getDroitsByEvaluation(1L)).thenReturn(droits);

        mockMvc.perform(get("/api/droits/evaluation/1"))
                .andExpect(status().isOk())
                .andExpect(content().json(asJsonString(droits)))
                .andDo(print());
    }

    @Test
    void testCreateDroit_Success() throws Exception {
        when(droitService.findById(any())).thenReturn(Optional.empty());
        when(droitService.createDroit(any(DroitDTO.class))).thenReturn(droit);

        mockMvc.perform(post("/api/droits")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(droitDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("Droit créé avec succès"))
                .andDo(print());
    }

    @Test
    void testCreateDroit_AlreadyExists() throws Exception {
        when(droitService.findById(any())).thenReturn(Optional.of(droit));

        mockMvc.perform(post("/api/droits")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(droitDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Droit déjà existant"))
                .andDo(print());
    }

    @Test
    void testUpdateDroit_Success() throws Exception {
        when(droitService.updateDroit(anyLong(), anyLong(), any(DroitDTO.class))).thenReturn(droit);

        mockMvc.perform(put("/api/droits/1/100")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(droitDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("Droit mis à jour avec succès"))
                .andDo(print());
    }

    @Test
    void testUpdateDroit_Failure() throws Exception {
        when(droitService.updateDroit(anyLong(), anyLong(), any(DroitDTO.class))).thenThrow(new RuntimeException("Error"));

        mockMvc.perform(put("/api/droits/1/100")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(droitDTO)))
                .andExpect(status().isBadRequest())
                .andDo(print());
    }

    @Test
    void testDeleteDroit_Success() throws Exception {
        doNothing().when(droitService).deleteDroit(anyLong(), anyLong());

        mockMvc.perform(delete("/api/droits/1/100"))
                .andExpect(status().isOk())
                .andExpect(content().string("Droit supprimé avec succès"))
                .andDo(print());
    }

    @Test
    void testDeleteDroit_Failure() throws Exception {
        doThrow(new RuntimeException("Error")).when(droitService).deleteDroit(anyLong(), anyLong());

        mockMvc.perform(delete("/api/droits/1/100"))
                .andExpect(status().isBadRequest())
                .andDo(print());
    }
}
