package com.example.backendagile.controllers;

import com.example.backendagile.dto.EtudiantDTO;
import com.example.backendagile.services.EtudiantService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.Optional;

public class EtudiantControllerTest {

    private MockMvc mockMvc;

    @Mock
    private EtudiantService etudiantService;

    @InjectMocks
    private EtudiantController etudiantController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(etudiantController).build();
    }

    /**
     * Test : Récupérer une liste paginée d'étudiants
     */
    @Test
    public void testGetAllEtudiantsWithPagination() throws Exception {
        EtudiantDTO etudiant1 = new EtudiantDTO();
        etudiant1.setNoEtudiant("E123");
        etudiant1.setNom("Doe");
        etudiant1.setPrenom("John");

        EtudiantDTO etudiant2 = new EtudiantDTO();
        etudiant2.setNoEtudiant("E456");
        etudiant2.setNom("Smith");
        etudiant2.setPrenom("Anna");

        Mockito.when(etudiantService.getEtudiantsPaged(1, 10))
                .thenReturn(Arrays.asList(etudiant1, etudiant2));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/etudiants")
                        .param("page", "1")
                        .param("size", "10"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].nom").value("Doe"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].nom").value("Smith"));
    }

    /**
     * Test : Récupérer un étudiant par son ID
     */
    @Test
    public void testGetEtudiantById() throws Exception {
        EtudiantDTO etudiant = new EtudiantDTO();
        etudiant.setNoEtudiant("E123");
        etudiant.setNom("Doe");
        etudiant.setPrenom("John");

        Mockito.when(etudiantService.findById(ArgumentMatchers.anyString()))
                .thenReturn(Optional.of(etudiant));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/etudiants/E123"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.nom").value("Doe"));
    }

    /**
     * Test : Créer un nouvel étudiant
     */
    @Test
    public void testCreateEtudiant() throws Exception {
        EtudiantDTO etudiant = new EtudiantDTO();
        etudiant.setNoEtudiant("E123");
        etudiant.setNom("Doe");
        etudiant.setPrenom("John");

        Mockito.when(etudiantService.save(ArgumentMatchers.any(EtudiantDTO.class)))
                .thenReturn(etudiant);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/etudiants")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"noEtudiant\": \"E123\", \"nom\": \"Doe\", \"prenom\": \"John\"}"))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.nom").value("Doe"));
    }

    /**
     * Test : Mettre à jour un étudiant existant
     */
    @Test
    public void testUpdateEtudiant() throws Exception {
        EtudiantDTO etudiant = new EtudiantDTO();
        etudiant.setNoEtudiant("E123");
        etudiant.setNom("Doe");
        etudiant.setPrenom("John");

        Mockito.when(etudiantService.findById(ArgumentMatchers.anyString()))
                .thenReturn(Optional.of(etudiant));
        Mockito.when(etudiantService.update(ArgumentMatchers.anyString(), ArgumentMatchers.any(EtudiantDTO.class)))
                .thenReturn(etudiant);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/etudiants/E123")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nom\": \"Doe Updated\", \"prenom\": \"John\"}"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.nom").value("Doe"));
    }

    /**
     * Test : Supprimer un étudiant par son ID
     */
    @Test
    public void testDeleteEtudiant() throws Exception {
        EtudiantDTO etudiant = new EtudiantDTO();
        etudiant.setNoEtudiant("E123");

        Mockito.when(etudiantService.findById(ArgumentMatchers.anyString()))
                .thenReturn(Optional.of(etudiant));
        Mockito.doNothing().when(etudiantService).deleteById(ArgumentMatchers.anyString());

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/etudiants/E123"))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }
}
