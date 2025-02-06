package com.example.backendagile.controllers;

import com.example.backendagile.entities.Etudiant;
import com.example.backendagile.services.EtudiantService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

public class EtudiantControllerTest {

    @Mock
    private EtudiantService etudiantService;

    @InjectMocks
    private EtudiantController etudiantController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAllEtudiants() {
        Etudiant etudiant1 = new Etudiant();
        etudiant1.setNoEtudiant("1");
        Etudiant etudiant2 = new Etudiant();
        etudiant2.setNoEtudiant("2");

        when(etudiantService.findAll()).thenReturn(Arrays.asList(etudiant1, etudiant2));

        List<Etudiant> etudiants = etudiantController.getAllEtudiants();

        assertEquals(2, etudiants.size());
        verify(etudiantService, times(1)).findAll();
    }

    @Test
    public void testGetEtudiantById() {
        Etudiant etudiant = new Etudiant();
        etudiant.setNoEtudiant("1");

        when(etudiantService.findById(anyLong())).thenReturn(Optional.of(etudiant));

        ResponseEntity<Etudiant> response = etudiantController.getEtudiantById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(etudiant, response.getBody());
        verify(etudiantService, times(1)).findById(1L);
    }

    @Test
    public void testGetEtudiantById_NotFound() {
        when(etudiantService.findById(anyLong())).thenReturn(Optional.empty());

        ResponseEntity<Etudiant> response = etudiantController.getEtudiantById(1L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(etudiantService, times(1)).findById(1L);
    }

    @Test
    public void testCreateEtudiant() {
        Etudiant etudiant = new Etudiant();
        etudiant.setNoEtudiant("1");

        when(etudiantService.save(any(Etudiant.class))).thenReturn(etudiant);

        Etudiant createdEtudiant = etudiantController.createEtudiant(etudiant);

        assertEquals(etudiant, createdEtudiant);
        verify(etudiantService, times(1)).save(etudiant);
    }

    @Test
    public void testUpdateEtudiant() {
        Etudiant etudiant = new Etudiant();
        etudiant.setNoEtudiant("1");

        when(etudiantService.findById(anyLong())).thenReturn(Optional.of(etudiant));
        when(etudiantService.save(any(Etudiant.class))).thenReturn(etudiant);

        ResponseEntity<Etudiant> response = etudiantController.updateEtudiant(1L, etudiant);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(etudiant, response.getBody());
        verify(etudiantService, times(1)).findById(1L);
        verify(etudiantService, times(1)).save(etudiant);
    }

    @Test
    public void testUpdateEtudiant_NotFound() {
        Etudiant etudiant = new Etudiant();
        etudiant.setNoEtudiant("1");

        when(etudiantService.findById(anyLong())).thenReturn(Optional.empty());

        ResponseEntity<Etudiant> response = etudiantController.updateEtudiant(1L, etudiant);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(etudiantService, times(1)).findById(1L);
        verify(etudiantService, times(0)).save(any(Etudiant.class));
    }

    @Test
    public void testDeleteEtudiant() {
        Etudiant etudiant = new Etudiant();
        etudiant.setNoEtudiant("1");

        when(etudiantService.findById(anyLong())).thenReturn(Optional.of(etudiant));
        doNothing().when(etudiantService).deleteById(anyLong());

        ResponseEntity<String> response = etudiantController.deleteEtudiant(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Étudiant supprimé avec succès.", response.getBody());
        verify(etudiantService, times(1)).findById(1L);
        verify(etudiantService, times(1)).deleteById(1L);
    }

    @Test
    public void testDeleteEtudiant_NotFound() {
        when(etudiantService.findById(anyLong())).thenReturn(Optional.empty());

        ResponseEntity<String> response = etudiantController.deleteEtudiant(100L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Aucun étudiant trouvé avec cet ID.", response.getBody());
        verify(etudiantService, times(1)).findById(100L);
        verify(etudiantService, times(0)).deleteById(anyLong());
    }
}
