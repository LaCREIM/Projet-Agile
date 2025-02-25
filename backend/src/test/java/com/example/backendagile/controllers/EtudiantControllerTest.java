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

import java.time.LocalDate;
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
    etudiant.setSexe("M");
    etudiant.setLieuNaissance("Paris");
    etudiant.setMobile("1234567890");
    etudiant.setNationalite("French");
    etudiant.setVille("Paris");
    etudiant.setPaysOrigine("France");
    etudiant.setCodePostal("75000");
    etudiant.setGroupeAnglais(1L);
    etudiant.setDateNaissance(LocalDate.of(1990, 1, 1));
    etudiant.setEmail("john.doe@example.com");
    etudiant.setUniversiteOrigine("Sorbonne");
    etudiant.setAnneeUniversitaire("2023-2024");
    etudiant.setTelephone("0987654321");
    etudiant.setAdresse("123 Rue de Paris");
    etudiant.setGroupeTp(2L);
    etudiant.setCodeFormation("CS101");
    etudiant.setMotPasse("password123");
    etudiant.setEmailUbo("john.doe@ubo.fr");

    Mockito.when(etudiantService.save(ArgumentMatchers.any(EtudiantDTO.class)))
            .thenReturn(etudiant);

    mockMvc.perform(MockMvcRequestBuilders.post("/api/etudiants")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"noEtudiant\": \"E123\", \"nom\": \"Doe\", \"prenom\": \"John\", \"sexe\": \"M\", \"lieuNaissance\": \"Paris\", \"mobile\": \"1234567890\", \"nationalite\": \"French\", \"ville\": \"Paris\", \"paysOrigine\": \"France\", \"codePostal\": \"75000\", \"groupeAnglais\": 1, \"dateNaissance\": \"1990-01-01\", \"email\": \"john.doe@example.com\", \"universiteOrigine\": \"Sorbonne\", \"anneeUniversitaire\": \"2023-2024\", \"telephone\": \"0987654321\", \"adresse\": \"123 Rue de Paris\", \"groupeTp\": 2, \"codeFormation\": \"CS101\", \"motPasse\": \"password123\", \"emailUbo\": \"john.doe@ubo.fr\"}"))
            .andExpect(MockMvcResultMatchers.status().isCreated())
            .andExpect(MockMvcResultMatchers.content().string("Étudiant créé avec succès."));
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
                .andExpect(MockMvcResultMatchers.content().string("Étudiant mis à jour avec succès."));
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
