package com.example.backendagile.repositories;
import com.example.backendagile.entities.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;

@Repository
public interface EtudiantRepository extends JpaRepository<Etudiant, Long> {
    @Query("SELECT e FROM Etudiant e WHERE e.promotion.id.anneeUniversitaire = :anneeUniversitaire")
    List<Etudiant> findByPromotionCode(@Param("anneeUniversitaire") String anneeUniversitaire);
    @Query(value = """
    SELECT * FROM (
        SELECT e.*, ROWNUM rnum FROM (
            SELECT * FROM dosi_dev.etudiant ORDER BY annee_universitaire DESC, nom ASC
        ) e WHERE ROWNUM <= :endRow
    ) WHERE rnum > :startRow
""", nativeQuery = true)
    List<Etudiant> findAllWithPagination(@Param("startRow") int startRow, @Param("endRow") int endRow);
}