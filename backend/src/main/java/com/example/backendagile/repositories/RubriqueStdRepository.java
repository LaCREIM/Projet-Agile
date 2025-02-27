package com.example.backendagile.repositories;

import com.example.backendagile.entities.Rubrique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RubriqueStdRepository extends JpaRepository<Rubrique, Long> {
    List<Rubrique> findByType(String type);

    List<Rubrique> findRubriqueByDesignation(String designation);
}
