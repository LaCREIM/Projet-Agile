package com.example.backendagile.controllers;

import com.example.backendagile.dto.QualificatifDTO;
import com.example.backendagile.entities.Qualificatif;
import com.example.backendagile.mapper.QualificatifMapper;
import com.example.backendagile.services.QualificatifService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
//import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(QualificatifController.class)
public class QualificatifControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private QualificatifService qualificatifService;

    @MockBean
    private QualificatifMapper qualificatifMapper;

    private Qualificatif qualificatif;
    private QualificatifDTO qualificatifDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        qualificatif = new Qualificatif();
        qualificatif.setId(1L);
        qualificatif.setMaximal("Excellent");
        qualificatif.setMinimal("Poor");

        qualificatifDTO = new QualificatifDTO();
        qualificatifDTO.setMaximal("Excellent");
        qualificatifDTO.setMinimal("Poor");
    }

    @Test
    void testGetAllQualificatifs() throws Exception {
        when(qualificatifService.findAll()).thenReturn(Arrays.asList(qualificatif));
        when(qualificatifMapper.toDto(any(Qualificatif.class))).thenReturn(qualificatifDTO);

        mockMvc.perform(get("/api/qualificatifs")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].maximal").value(qualificatifDTO.getMaximal()))
                .andExpect(jsonPath("$[0].minimal").value(qualificatifDTO.getMinimal()));
    }

    @Test
    void testGetQualificatifById() throws Exception {
        when(qualificatifService.findById(anyLong())).thenReturn(Optional.of(qualificatif));
        when(qualificatifMapper.toDto(any(Qualificatif.class))).thenReturn(qualificatifDTO);

        mockMvc.perform(get("/api/qualificatifs/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.maximal").value(qualificatifDTO.getMaximal()))
                .andExpect(jsonPath("$.minimal").value(qualificatifDTO.getMinimal()));
    }

    @Test
    void testGetQualificatifByIdNotFound() throws Exception {
        when(qualificatifService.findById(anyLong())).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/qualificatifs/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateQualificatif() throws Exception {
        when(qualificatifMapper.toEntity(any(QualificatifDTO.class))).thenReturn(qualificatif);
        when(qualificatifService.save(any(Qualificatif.class))).thenReturn(qualificatif);
        when(qualificatifMapper.toDto(any(Qualificatif.class))).thenReturn(qualificatifDTO);

        mockMvc.perform(post("/api/qualificatifs")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"maximal\": \"Excellent\", \"minimal\": \"Poor\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.maximal").value(qualificatifDTO.getMaximal()))
                .andExpect(jsonPath("$.minimal").value(qualificatifDTO.getMinimal()));
    }

    @Test
    void testUpdateQualificatif() throws Exception {
        Qualificatif updatedQualificatif = new Qualificatif();
        updatedQualificatif.setId(1L);
        updatedQualificatif.setMaximal("Very Good");
        updatedQualificatif.setMinimal("Bad");

        QualificatifDTO updatedQualificatifDTO = new QualificatifDTO();
        updatedQualificatifDTO.setMaximal("Very Good");
        updatedQualificatifDTO.setMinimal("Bad");

        when(qualificatifService.findById(anyLong())).thenReturn(Optional.of(qualificatif));
        when(qualificatifMapper.toEntity(any(QualificatifDTO.class))).thenReturn(updatedQualificatif);
        when(qualificatifService.save(any(Qualificatif.class))).thenReturn(updatedQualificatif);
        when(qualificatifMapper.toDto(any(Qualificatif.class))).thenReturn(updatedQualificatifDTO);

        mockMvc.perform(put("/api/qualificatifs/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"maximal\": \"Very Good\", \"minimal\": \"Bad\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.maximal").value("Very Good"))
                .andExpect(jsonPath("$.minimal").value("Bad"));
    }

    @Test
    void testDeleteQualificatif() throws Exception {
        when(qualificatifService.findById(anyLong())).thenReturn(Optional.of(qualificatif));
    
        mockMvc.perform(delete("/api/qualificatifs/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()) 
                .andExpect(content().string("Le qualificatif a été supprimé avec succès."));
    }
    

    @Test
    void testDeleteQualificatifNotFound() throws Exception {
        when(qualificatifService.findById(anyLong())).thenReturn(Optional.empty());

        mockMvc.perform(delete("/api/qualificatifs/999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Aucun qualificatif trouvé pour cet id."));
    }
}