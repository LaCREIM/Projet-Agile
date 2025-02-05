package com.example.backendagile.controllers;

import com.example.backendagile.entities.Enseignant;
import com.example.backendagile.services.EnseignantService;
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

//import static org.mockito.ArgumentMatchers.any;

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
    public void testGetAllEnseignants() throws Exception {
        Enseignant enseignant1 = new Enseignant();
        enseignant1.setId(1);
        enseignant1.setType("MCF");
        enseignant1.setSexe("H");
        enseignant1.setNom("Saliou");
        enseignant1.setPrenom("Philippe");
        enseignant1.setAdresse("6 rue de lArgoat");
        enseignant1.setCodePostal("29860");
        enseignant1.setVille("LE DRENNEC");
        enseignant1.setPays("FR");
        enseignant1.setMobile("06.29.24.01.00");
        enseignant1.setTelephone("02.98.01.69.74");
        enseignant1.setEmailUbo("philippe.saliou@univ-brest.fr");
        enseignant1.setEmailPerso("philippe.saliou@gmail.com");

        Enseignant enseignant2 = new Enseignant();
        enseignant2.setId(2);
        enseignant2.setType("MCF");
        enseignant2.setSexe("H");
        enseignant2.setNom("Lallali");
        enseignant2.setPrenom("Mounir");
        enseignant2.setAdresse("18rue Jean Jaures");
        enseignant2.setCodePostal("29200");
        enseignant2.setVille("BREST");
        enseignant2.setPays("FR");
        enseignant2.setMobile("06.32.03.56.32");
        enseignant2.setTelephone("02.08.01.67.32");
        enseignant2.setEmailUbo("mounir.lallali@univ-brest.fr");
        enseignant2.setEmailPerso("mouni.lallali@gmail.com");

        Mockito.when(enseignantService.findAll()).thenReturn(Arrays.asList(enseignant1, enseignant2));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/enseignants"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].nom").value("Saliou"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].nom").value("Lallali"));
    }

    @Test
    public void testGetEnseignantById() throws Exception {
        Enseignant enseignant = new Enseignant();
        enseignant.setId(1);
        enseignant.setType("MCF");
        enseignant.setSexe("H");
        enseignant.setNom("Saliou");
        enseignant.setPrenom("Philippe");
        enseignant.setAdresse("6 rue de lArgoat");
        enseignant.setCodePostal("29860");
        enseignant.setVille("LE DRENNEC");
        enseignant.setPays("FR");
        enseignant.setMobile("06.29.24.01.00");
        enseignant.setTelephone("02.98.01.69.74");
        enseignant.setEmailUbo("philippe.saliou@univ-brest.fr");
        enseignant.setEmailPerso("philippe.saliou@gmail.com");

        Mockito.when(enseignantService.findById(ArgumentMatchers.anyLong())).thenReturn(Optional.of(enseignant));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/enseignants/" + enseignant.getId()))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.nom").value("Saliou"));
    }

    @Test
    public void testCreateEnseignant() throws Exception {
        Enseignant enseignant = new Enseignant();
        enseignant.setType("MCF");
        enseignant.setSexe("H");
        enseignant.setNom("Saliou");
        enseignant.setPrenom("Philippe");
        enseignant.setAdresse("6 rue de lArgoat");
        enseignant.setCodePostal("29860");
        enseignant.setVille("LE DRENNEC");
        enseignant.setPays("FR");
        enseignant.setMobile("06.29.24.01.00");
        enseignant.setTelephone("02.98.01.69.74");
        enseignant.setEmailUbo("philippe.saliou@univ-brest.fr");
        enseignant.setEmailPerso("philippe.saliou@gmail.com");

        Mockito.when(enseignantService.save(ArgumentMatchers.any(Enseignant.class))).thenReturn(enseignant);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/enseignants")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"type\": \"MCF\", \"sexe\": \"H\", \"nom\": \"Saliou\", \"prenom\": \"Philippe\", \"adresse\": \"6 rue de lArgoat\", \"codePostal\": \"29860\", \"ville\": \"LE DRENNEC\", \"pays\": \"FR\", \"mobile\": \"06.29.24.01.00\", \"telephone\": \"02.98.01.69.74\", \"emailUbo\": \"philippe.saliou@univ-brest.fr\", \"emailPerso\": \"philippe.saliou@gmail.com\"}"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.nom").value("Saliou"));
    }

    @Test
    public void testUpdateEnseignant() throws Exception {
        Enseignant enseignant = new Enseignant();
        enseignant.setId(1);
        enseignant.setType("MCF");
        enseignant.setSexe("H");
        enseignant.setNom("Saliou");
        enseignant.setPrenom("Philippe");
        enseignant.setAdresse("6 rue de lArgoat");
        enseignant.setCodePostal("29860");
        enseignant.setVille("LE DRENNEC");
        enseignant.setPays("FR");
        enseignant.setMobile("06.29.24.01.00");
        enseignant.setTelephone("02.98.01.69.74");
        enseignant.setEmailUbo("philippe.saliou@univ-brest.fr");
        enseignant.setEmailPerso("philippe.saliou@gmail.com");

        Mockito.when(enseignantService.findById(ArgumentMatchers.anyLong())).thenReturn(Optional.of(enseignant));
        Mockito.when(enseignantService.save(ArgumentMatchers.any(Enseignant.class))).thenReturn(enseignant);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/enseignants/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"type\": \"MCF\", \"sexe\": \"H\", \"nom\": \"Saliou Updated\", \"prenom\": \"Philippe\", \"adresse\": \"6 rue de lArgoat\", \"codePostal\": \"29860\", \"ville\": \"LE DRENNEC\", \"pays\": \"FR\", \"mobile\": \"06.29.24.01.00\", \"telephone\": \"02.98.01.69.74\", \"emailUbo\": \"philippe.saliou@univ-brest.fr\", \"emailPerso\": \"philippe.saliou@gmail.com\"}"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.nom").value("Saliou Updated"));
    }

    @Test
    public void testDeleteEnseignant() throws Exception {
        Enseignant enseignant = new Enseignant();
        enseignant.setId(1);
        enseignant.setType("MCF");
        enseignant.setSexe("H");
        enseignant.setNom("Saliou");
        enseignant.setPrenom("Philippe");
        enseignant.setAdresse("6 rue de lArgoat");
        enseignant.setCodePostal("29860");
        enseignant.setVille("LE DRENNEC");
        enseignant.setPays("FR");
        enseignant.setMobile("06.29.24.01.00");
        enseignant.setTelephone("02.98.01.69.74");
        enseignant.setEmailUbo("philippe.saliou@univ-brest.fr");
        enseignant.setEmailPerso("philippe.saliou@gmail.com");

        Mockito.when(enseignantService.findById(ArgumentMatchers.anyLong())).thenReturn(Optional.of(enseignant));
        Mockito.doNothing().when(enseignantService).deleteById(ArgumentMatchers.anyLong());

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/enseignants/1"))
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }
}