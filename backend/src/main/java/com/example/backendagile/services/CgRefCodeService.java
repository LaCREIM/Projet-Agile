package com.example.backendagile.services;

import com.example.backendagile.entities.CgRefCode;
import com.example.backendagile.repositories.CgRefCodeRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CgRefCodeService {
    private final CgRefCodeRepository cgRefCodeRepository;

    public CgRefCodeService(CgRefCodeRepository cgRefCodeRepository) {
        this.cgRefCodeRepository = cgRefCodeRepository;
    }

    public List<CgRefCode> getAllByRvDomain(String rvDomain) {
        return cgRefCodeRepository.findByRvDomain(rvDomain);
    }
}
