package com.example.backendagile.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "REPONSE_QUESTION", schema = "DOSI_DEV", indexes = {
        @Index(name = "RPQ_RPE_FK_I", columnList = "ID_REPONSE_EVALUATION"),
        @Index(name = "RPQ_QEV_FK_I", columnList = "ID_QUESTION_EVALUATION")
})
public class ReponseQuestion {
    @EmbeddedId
    private ReponseQuestionId id;

    @MapsId("idReponseEvaluation")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_REPONSE_EVALUATION", nullable = false)
    private ReponseEvaluation idReponseEvaluation;

    @MapsId("idQuestionEvaluation")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_QUESTION_EVALUATION", nullable = false)
    private QuestionEvaluation idQuestionEvaluation;

    @Column(name = "POSITIONNEMENT")
    private Long positionnement;

    public ReponseQuestionId getId() {
        return id;
    }

    public void setId(ReponseQuestionId id) {
        this.id = id;
    }

    public ReponseEvaluation getIdReponseEvaluation() {
        return idReponseEvaluation;
    }

    public void setIdReponseEvaluation(ReponseEvaluation idReponseEvaluation) {
        this.idReponseEvaluation = idReponseEvaluation;
    }

    public QuestionEvaluation getIdQuestionEvaluation() {
        return idQuestionEvaluation;
    }

    public void setIdQuestionEvaluation(QuestionEvaluation idQuestionEvaluation) {
        this.idQuestionEvaluation = idQuestionEvaluation;
    }

    public Long getPositionnement() {
        return positionnement;
    }

    public void setPositionnement(Long positionnement) {
        this.positionnement = positionnement;
    }

}