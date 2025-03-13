package com.example.backendagile.repositories;
import com.example.backendagile.entities.Etudiant;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.Optional;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;

@Repository
public interface EtudiantRepository extends JpaRepository<Etudiant, String> {
    @Query("SELECT e FROM Etudiant e WHERE e.promotion.id.anneeUniversitaire = :anneeUniversitaire AND e.promotion.id.codeFormation = :codeFormation")
List<Etudiant> findByPromotionCodeAndFormation(@Param("anneeUniversitaire") String anneeUniversitaire, @Param("codeFormation") String codeFormation);

    @Query(value = """
    SELECT * FROM (
        SELECT e.*, ROWNUM rnum FROM (
            SELECT * FROM etudiant   ORDER BY annee_universitaire DESC, nom ASC
        ) e WHERE ROWNUM <= :endRow
    ) WHERE rnum > :startRow
""", nativeQuery = true)
    List<Etudiant> findAllWithPagination(@Param("startRow") int startRow, @Param("endRow") int endRow);

    List<Etudiant> findByNomAndPrenom(String nom, String prenom);

    List<Etudiant> findByEmail(@NotBlank String email);
    
    @Query("SELECT e FROM Etudiant e " +
       "WHERE LOWER(e.nom) LIKE %:keyword% " +
       "OR LOWER(e.prenom) LIKE %:keyword% " +
       "OR LOWER(e.nationalite) LIKE %:keyword% " +
       "OR LOWER(e.email) LIKE %:keyword% " +
       "OR LOWER(e.promotion.id.anneeUniversitaire) LIKE %:keyword% " +
       "OR LOWER(e.promotion.id.codeFormation) LIKE %:keyword% " +
       "OR LOWER(e.universiteOrigine) LIKE %:keyword%")
List<Etudiant> searchEtudiants(@Param("keyword") String keyword);


    List<Etudiant> findByNoEtudiant(String noEtudiant);

    @Query("SELECT e FROM Etudiant e WHERE e.email = :email AND e.noEtudiant != :id")
    List<Etudiant> findByEmailandId(@NotBlank String email, String id);

    Optional<Etudiant> findById(String id);


}