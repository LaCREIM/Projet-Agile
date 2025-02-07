package com.example.backendagile.mapper;

import com.example.backendagile.dto.EnseignantDTO;
import com.example.backendagile.entities.Enseignant;
import org.springframework.stereotype.Component;

@Component
public class EnseignantMapper {

    public EnseignantDTO toDto(Enseignant enseignant) {
        EnseignantDTO dto = new EnseignantDTO();
        dto.setNom(enseignant.getNom());
        dto.setPrenom(enseignant.getPrenom());
        dto.setAdresse(enseignant.getAdresse());
        dto.setSexe(enseignant.getSexe());
        dto.setVille(enseignant.getVille());
        dto.setPays(enseignant.getPays());
        dto.setMobile(enseignant.getMobile());
        dto.setTelephone(enseignant.getTelephone());
        dto.setCodePostal(enseignant.getCodePostal());
        dto.setType(enseignant.getType());
        dto.setEmailUbo(enseignant.getEmailUbo());
        dto.setEmailPerso(enseignant.getEmailPerso());
        //dto.setPassword(enseignant.getPassword());
        return dto;
    }

    public Enseignant toEntity(EnseignantDTO dto) {
        Enseignant enseignant = new Enseignant();
        enseignant.setNom(dto.getNom());
        enseignant.setPrenom(dto.getPrenom());
        enseignant.setAdresse(dto.getAdresse());
        enseignant.setSexe(dto.getSexe());
        enseignant.setVille(dto.getVille());
        enseignant.setPays(dto.getPays());
        enseignant.setMobile(dto.getMobile());
        enseignant.setTelephone(dto.getTelephone());
        enseignant.setCodePostal(dto.getCodePostal());
        enseignant.setType(dto.getType());
        enseignant.setEmailUbo(dto.getEmailUbo());
        enseignant.setEmailPerso(dto.getEmailPerso());
        //enseignant.setPassword(dto.getPassword());
        return enseignant;
    }
}