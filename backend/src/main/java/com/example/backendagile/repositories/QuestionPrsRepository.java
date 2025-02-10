package com.example.backendagile.repositories;

import com.example.backendagile.entities.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionPrsRepository extends JpaRepository<Question, Long> {
}
