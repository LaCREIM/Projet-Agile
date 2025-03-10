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
}
