package com.example.backendagile.controllers;

import com.example.backendagile.entities.Enseignant;
import com.example.backendagile.services.EnseignantService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.Optional;

public class EnseignantControllerTest {

    private MockMvc mockMvc;

    @Mock
    private EnseignantService enseignantService;

    @InjectMocks
    private EnseignantController enseignantController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(enseignantController).build();
    }

    @Test
    public void testGetAllEnseignantsWithPagination() throws Exception {
        Enseignant enseignant1 = new Enseignant();
        enseignant1.setId(1L);
        enseignant1.setNom("Saliou");

        Enseignant enseignant2 = new Enseignant();
        enseignant2.setId(2L);
        enseignant2.setNom("Lallali");

        Mockito.when(enseignantService.getEnseignantPaged(1, 20))
                .thenReturn(Arrays.asList(enseignant1, enseignant2));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/enseignants")
                        .param("page", "1")
                        .param("size", "20"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].nom").value("Saliou"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.content[1].nom").value("Lallali"));
    }

    @Test
    public void testGetEnseignantById() throws Exception {
        Enseignant enseignant = new Enseignant();
        enseignant.setId(1L);
        enseignant.setNom("Saliou");

        Mockito.when(enseignantService.findById(ArgumentMatchers.anyLong()))
                .thenReturn(Optional.of(enseignant));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/enseignants/1"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.nom").value("Saliou"));
    }

    @Test
    public void testCreateEnseignant() throws Exception {
        Enseignant enseignant = new Enseignant();
        enseignant.setNom("Saliou");

        Mockito.when(enseignantService.save(ArgumentMatchers.any(Enseignant.class)))
                .thenReturn(enseignant);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/enseignants")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nom\": \"Saliou\"}"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.nom").value("Saliou"));
    }

    @Test
    public void testUpdateEnseignant() throws Exception {
        Enseignant enseignant = new Enseignant();
        enseignant.setId(1L);
        enseignant.setNom("Saliou");

        Mockito.when(enseignantService.findById(ArgumentMatchers.anyLong()))
                .thenReturn(Optional.of(enseignant));
        Mockito.when(enseignantService.save(ArgumentMatchers.any(Enseignant.class)))
                .thenReturn(enseignant);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/enseignants/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nom\": \"Saliou Updated\"}"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.nom").value("Saliou Updated"));
    }

    @Test
    public void testDeleteEnseignant() throws Exception {
        Enseignant enseignant = new Enseignant();
        enseignant.setId(1L);

        Mockito.when(enseignantService.findById(ArgumentMatchers.anyLong()))
                .thenReturn(Optional.of(enseignant));
        Mockito.doNothing().when(enseignantService).deleteById(ArgumentMatchers.anyLong());

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/enseignants/1"))
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }
}