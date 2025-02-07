package com.example.backendagile.repositories;
import com.example.backendagile.entities.Qualificatif;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QualificatifRepository extends JpaRepository<Qualificatif,Long> {
    
}
