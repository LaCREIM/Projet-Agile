package com.example.backendagile.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.backendagile.entities.ReponseEvaluation;
import com.example.backendagile.entities.ReponseQuestion;
import org.springframework.transaction.annotation.Transactional;

public interface ReponseQuestionRepository extends  JpaRepository<ReponseQuestion, ReponseEvaluation>{
    
    @Query("SELECT rq.positionnement FROM ReponseQuestion rq WHERE rq.id.idReponseEvaluation = ?1 AND rq.id.idQuestionEvaluation = ?2")
    Long findPositionnement(Long idReponseEval, Long idQuestionEval);

    @Transactional
    @Modifying
    @Query("DELETE FROM ReponseQuestion rq WHERE rq.idReponseEvaluation.id = ?1")
    void deleteByIdReponseEvaluation(Long idReponseEval);


}
