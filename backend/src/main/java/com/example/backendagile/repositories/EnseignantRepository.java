package com.example.backendagile.repositories;

import com.example.backendagile.entities.Enseignant;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnseignantRepository extends JpaRepository<Enseignant, Long> {
    @Query(value = """
                SELECT * FROM (
                    SELECT e.*, ROWNUM rnum FROM (
                        SELECT * FROM enseignant ORDER BY nom
                    ) e WHERE ROWNUM <= :endRow
                ) WHERE rnum > :startRow
            """, nativeQuery = true)
    List<Enseignant> findAllWithPagination(@Param("startRow") int startRow, @Param("endRow") int endRow);

    List<Enseignant> findByNomAndPrenom(String nom, String prenom);

    List<Enseignant> findByEmailUbo(@NotBlank @Email String emailUbo);
}
