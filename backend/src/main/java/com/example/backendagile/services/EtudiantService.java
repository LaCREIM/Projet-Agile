package com.example.backendagile.services;

import com.example.backendagile.dto.EtudiantDTO;
import com.example.backendagile.entities.Etudiant;
import com.example.backendagile.entities.Promotion;
import com.example.backendagile.entities.PromotionId;
import com.example.backendagile.mapper.EtudiantMapper;
import com.example.backendagile.repositories.EtudiantRepository;
import com.example.backendagile.repositories.PromotionRepository;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EtudiantService {

    @Autowired
    private EtudiantRepository etudiantRepository;

    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private EtudiantMapper etudiantMapper;

    /**
     * Récupérer une liste paginée d'étudiants
     */
    public List<EtudiantDTO> getEtudiantsPaged(int page, int size) {
        int startRow = (page - 1) * size;
        int endRow = page * size;

        List<Etudiant> etudiants = etudiantRepository.findAllWithPagination(startRow, endRow);

        return etudiants.stream()
                .map(etudiantMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Trouver un étudiant par son ID
     */
    public Optional<EtudiantDTO> findById(String id) {
        return etudiantRepository.findById(id).map(etudiantMapper::toDto);
    }

    /**
     * Sauvegarder un nouvel étudiant
     */
    public EtudiantDTO save(EtudiantDTO etudiantDTO) {
        Promotion promotion = promotionRepository.findById(
                        new PromotionId(etudiantDTO.getAnneeUniversitaire(), etudiantDTO.getCodeFormation()))
                .orElseThrow(() -> new RuntimeException("Promotion introuvable"));

        Etudiant etudiant = etudiantMapper.toEntity(etudiantDTO, promotion);
        etudiant = etudiantRepository.save(etudiant);
        return etudiantMapper.toDto(etudiant);
    }

    /**
     * Mettre à jour un étudiant existant
     */
    public EtudiantDTO update(String id, EtudiantDTO etudiantDTO) {
        Etudiant etudiant = etudiantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));

        Promotion promotion = promotionRepository.findById(
                        new PromotionId(etudiantDTO.getAnneeUniversitaire(), etudiantDTO.getCodeFormation()))
                .orElseThrow(() -> new RuntimeException("Promotion non trouvée"));

        etudiant.setNom(etudiantDTO.getNom());
        etudiant.setPrenom(etudiantDTO.getPrenom());
        etudiant.setSexe(etudiantDTO.getSexe());
        etudiant.setDateNaissance(etudiantDTO.getDateNaissance());
        etudiant.setLieuNaissance(etudiantDTO.getLieuNaissance());
        etudiant.setNationalite(etudiantDTO.getNationalite());
        etudiant.setTelephone(etudiantDTO.getTelephone());
        etudiant.setMobile(etudiantDTO.getMobile());
        etudiant.setEmail(etudiantDTO.getEmail());
        etudiant.setEmailUbo(etudiantDTO.getEmailUbo());
        etudiant.setAdresse(etudiantDTO.getAdresse());
        etudiant.setCodePostal(etudiantDTO.getCodePostal());
        etudiant.setVille(etudiantDTO.getVille());
        etudiant.setPaysOrigine(etudiantDTO.getPaysOrigine());
        etudiant.setUniversiteOrigine(etudiantDTO.getUniversiteOrigine());
        etudiant.setGroupeTp(etudiantDTO.getGroupeTp());
        etudiant.setGroupeAnglais(etudiantDTO.getGroupeAnglais());
        etudiant.setPromotion(promotion);

        return etudiantMapper.toDto(etudiantRepository.save(etudiant));
    }

    /**
     * Supprimer un étudiant par son ID
     */
    public void deleteById(String id) {
        etudiantRepository.deleteById(id);
    }

    /**
     * Récupérer les étudiants par promotion
     */
    public List<EtudiantDTO> findEtudiantsByPromotion(String anneeUniversitaire, String codeFormation) {
        return etudiantRepository.findByPromotionCodeAndFormation(anneeUniversitaire, codeFormation)
                .stream()
                .map(etudiantMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<Etudiant> getByNomAndPrenom(String nom, String prenom) {
        return etudiantRepository.findByNomAndPrenom(nom, prenom);
    }

    public Optional<Etudiant> findByEmail(String emailUbo) {
        return etudiantRepository.findByEmail(emailUbo).stream().findFirst();
    }
}
