package com.example.backendagile.controllers;

import com.example.backendagile.entities.CgRefCode;
import com.example.backendagile.services.CgRefCodeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cgRefCodes")
public class CgRefCodeController {
    private final CgRefCodeService cgRefCodeService;

    public CgRefCodeController(CgRefCodeService cgRefCodeService) {
        this.cgRefCodeService = cgRefCodeService;
    }

    @GetMapping("/byDomain")
    public ResponseEntity<List<CgRefCode>> getByRvDomain(@RequestParam String domain) {
        List<CgRefCode> result = cgRefCodeService.getAllByRvDomain(domain);
        return ResponseEntity.ok(result);
    }
}
