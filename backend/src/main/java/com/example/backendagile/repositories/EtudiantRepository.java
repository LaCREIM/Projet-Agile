package com.example.backendagile.repositories;
import com.example.backendagile.entities.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EtudiantRepository extends JpaRepository<Etudiant, Long> {
    @Query("SELECT e FROM Etudiant e WHERE e.promotion.anneeUniversitaire = :anneeUniversitaire")
    List<Etudiant> findByPromotionCode(@Param("anneeUniversitaire") String anneeUniversitaire);

}