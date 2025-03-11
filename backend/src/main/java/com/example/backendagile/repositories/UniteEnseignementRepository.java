package com.example.backendagile.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.example.backendagile.entities.UniteEnseignement;
import java.util.List;
import com.example.backendagile.dto.UniteEnseignementDTO;
import com.example.backendagile.entities.UniteEnseignementId;

public interface UniteEnseignementRepository extends JpaRepository<UniteEnseignement, UniteEnseignementId> {

    @Query("SELECT new com.example.backendagile.dto.UniteEnseignementDTO(ue.id.codeUe, ue.designation) FROM UniteEnseignement ue")
    List<UniteEnseignementDTO> findAllUesWithCodeAndDesignation();


    @Query("SELECT ue FROM UniteEnseignement ue WHERE ue.noEnseignant.id = :noEnseignant")
    List<UniteEnseignement> findUniteEnseignementByNoEnseignant(Long noEnseignant);

    @Query("SELECT ue FROM UniteEnseignement ue WHERE ue.id.codeFormation = ?1 AND ue.id.codeUe = ?2")
    UniteEnseignement findById(String codeFormation, String codeUE);


    @Query("SELECT ue FROM UniteEnseignement ue WHERE ue.codeFormation.codeFormation = :codeFormation AND ue.noEnseignant.id = :noEnseignant")
    List<UniteEnseignement> findUniteEnseignementByPromotion(Long noEnseignant, String codeFormation);
}
