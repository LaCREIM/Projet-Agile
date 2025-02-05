package com.example.backendagile.repositories;

import com.example.backendagile.entities.Formation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FormationRepository extends JpaRepository<Formation, String> {
}
