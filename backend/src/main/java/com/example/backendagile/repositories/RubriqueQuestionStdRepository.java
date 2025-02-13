package com.example.backendagile.repositories;

import com.example.backendagile.entities.RubriqueQuestion;
import com.example.backendagile.entities.RubriqueQuestionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface RubriqueQuestionStdRepository extends JpaRepository<RubriqueQuestion, RubriqueQuestionId> {

}
