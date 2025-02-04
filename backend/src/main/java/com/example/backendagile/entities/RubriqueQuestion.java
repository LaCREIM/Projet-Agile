package com.example.backendagile.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "RUBRIQUE_QUESTION", schema = "DOSI_DEV", indexes = {
        @Index(name = "RBQ_RUB_FK_I", columnList = "ID_RUBRIQUE"),
        @Index(name = "RBQ_QUE_FK_I", columnList = "ID_QUESTION")
})
public class RubriqueQuestion {
    @EmbeddedId
    private RubriqueQuestionId id;

    @MapsId("idRubrique")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_RUBRIQUE", nullable = false)
    private Rubrique idRubrique;

    @MapsId("idQuestion")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_QUESTION", nullable = false)
    private Question idQuestion;

    @Column(name = "ORDRE", nullable = false)
    private Long ordre;

    public RubriqueQuestionId getId() {
        return id;
    }

    public void setId(RubriqueQuestionId id) {
        this.id = id;
    }

    public Rubrique getIdRubrique() {
        return idRubrique;
    }

    public void setIdRubrique(Rubrique idRubrique) {
        this.idRubrique = idRubrique;
    }

    public Question getIdQuestion() {
        return idQuestion;
    }

    public void setIdQuestion(Question idQuestion) {
        this.idQuestion = idQuestion;
    }

    public Long getOrdre() {
        return ordre;
    }

    public void setOrdre(Long ordre) {
        this.ordre = ordre;
    }

}