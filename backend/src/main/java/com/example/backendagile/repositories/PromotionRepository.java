package com.example.backendagile.repositories;

import com.example.backendagile.entities.Enseignant;
import com.example.backendagile.entities.Promotion;
import com.example.backendagile.entities.PromotionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, PromotionId> {
    @Query(value = """
                SELECT * FROM (
                    SELECT e.*, ROWNUM rnum FROM (
                        SELECT * FROM dosi_dev.promotion ORDER BY annee_universitaire DESC
                                                         ) e WHERE ROWNUM <= :endRow
                ) WHERE rnum > :startRow
            """, nativeQuery = true)
    List<Promotion> findAllWithPagination(@Param("startRow") int startRow, @Param("endRow") int endRow);

    @Query("SELECT p FROM Promotion p WHERE p.siglePromotion LIKE %:siglePromotion%")
    List<Promotion> findByNameContaining(@Param("siglePromotion") String siglePromotion);
  
    @Query("SELECT COUNT(p) FROM Promotion p WHERE p.enseignant = :enseignant")
    Long countByEnseignant(@Param("enseignant") Enseignant enseignant);

    @Query("SELECT p FROM Promotion p ORDER BY p.id.anneeUniversitaire DESC")
    List<Promotion> findAllPromotions();

    @Query("SELECT p FROM Promotion p " +
            "JOIN Formation f ON f.codeFormation = p.id.codeFormation " +
            "WHERE LOWER(p.id.codeFormation) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(p.id.anneeUniversitaire) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(p.enseignant.emailUbo) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(p.enseignant.nom) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(p.enseignant.prenom) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(f.nomFormation) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Promotion> searchPromotions(@Param("keyword") String keyword);

}


