package com.example.backendagile.mapper;


import com.example.backendagile.dto.EtudiantDTO;
import com.example.backendagile.entities.Etudiant;
import com.example.backendagile.entities.Promotion;




import org.springframework.stereotype.Component;

@Component
public class EtudiantMapper {

    public EtudiantDTO toDto(Etudiant etudiant) {
        if (etudiant == null) {
            return null;
        }

        EtudiantDTO dto = new EtudiantDTO();
        dto.setNoEtudiant(etudiant.getNoEtudiant());
        dto.setNom(etudiant.getNom());
        dto.setPrenom(etudiant.getPrenom());
        dto.setSexe(etudiant.getSexe());
        dto.setDateNaissance(etudiant.getDateNaissance());
        dto.setLieuNaissance(etudiant.getLieuNaissance());
        dto.setNationalite(etudiant.getNationalite());
        dto.setTelephone(etudiant.getTelephone());
        dto.setMobile(etudiant.getMobile());
        dto.setEmail(etudiant.getEmail());
        dto.setEmailUbo(etudiant.getEmailUbo());
        dto.setAdresse(etudiant.getAdresse());
        dto.setCodePostal(etudiant.getCodePostal());
        dto.setVille(etudiant.getVille());
        dto.setPaysOrigine(etudiant.getPaysOrigine());
        dto.setUniversiteOrigine(etudiant.getUniversiteOrigine());
        dto.setGroupeTp(etudiant.getGroupeTp());
        dto.setGroupeAnglais(etudiant.getGroupeAnglais());
       // dto.setPassword(etudiant.getPassword());

        // Mapping de la promotion
        if (etudiant.getPromotion() != null) {
            dto.setAnneeUniversitaire(etudiant.getPromotion().getId().getAnneeUniversitaire());
            dto.setCodeFormation(etudiant.getPromotion().getId().getCodeFormation());
        }

        return dto;
    }

    public Etudiant toEntity(EtudiantDTO dto, Promotion promotion) {
        if (dto == null) {
            return null;
        }

        Etudiant etudiant = new Etudiant();
        etudiant.setNoEtudiant(dto.getNoEtudiant());
        etudiant.setNom(dto.getNom());
        etudiant.setPrenom(dto.getPrenom());
        etudiant.setSexe(dto.getSexe());
        etudiant.setDateNaissance(dto.getDateNaissance());
        etudiant.setLieuNaissance(dto.getLieuNaissance());
        etudiant.setNationalite(dto.getNationalite());
        etudiant.setTelephone(dto.getTelephone());
        etudiant.setMobile(dto.getMobile());
        etudiant.setEmail(dto.getEmail());
        etudiant.setEmailUbo(dto.getEmailUbo());
        etudiant.setAdresse(dto.getAdresse());
        etudiant.setCodePostal(dto.getCodePostal());
        etudiant.setVille(dto.getVille());
        etudiant.setPaysOrigine(dto.getPaysOrigine());
        etudiant.setUniversiteOrigine(dto.getUniversiteOrigine());
        etudiant.setGroupeTp(dto.getGroupeTp());
        etudiant.setGroupeAnglais(dto.getGroupeAnglais());
        //etudiant.setPassword(dto.getPassword());

        // Associer la promotion
        etudiant.setPromotion(promotion);

        return etudiant;
    }
}
