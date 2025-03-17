package com.example.backendagile.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.backendagile.entities.ReponseEvaluation;
import com.example.backendagile.entities.ReponseQuestion;

public interface ReponseQuestionRepository extends  JpaRepository<ReponseQuestion, ReponseEvaluation>{
    
    @Query("SELECT rq.positionnement FROM ReponseQuestion rq WHERE rq.id.idReponseEvaluation = ?1 AND rq.id.idQuestionEvaluation = ?2")
    Long findPositionnement(Long idReponseEval, Long idQuestionEval);
}
