package com.example.backendagile.repositories;

import com.example.backendagile.entities.Enseignant;
import com.example.backendagile.entities.Promotion;
import com.example.backendagile.entities.PromotionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnseignantRepository extends JpaRepository<Enseignant, Long> {
}
