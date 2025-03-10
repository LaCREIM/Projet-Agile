package com.example.backendagile.controllers;
import com.example.backendagile.dto.ElementConstitutifDTO;
import com.example.backendagile.entities.ElementConstitutif;
import com.example.backendagile.services.ElementConstitutifService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/elements-constitutifs")
public class ElementConstitutifController {

    private final ElementConstitutifService elementConstitutifService;

    public ElementConstitutifController(ElementConstitutifService elementConstitutifService) {
        this.elementConstitutifService = elementConstitutifService;
    }

   /* @GetMapping("/{codeUe}")
    public ResponseEntity<List<ElementConstitutifDTO>> getAllECByCodeUE(@PathVariable String codeUe) {
        return ResponseEntity.ok(elementConstitutifService.getAllECByCodeUE(codeUe));
    } */
    

}

