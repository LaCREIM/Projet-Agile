package com.example.backendagile.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import org.hibernate.Hibernate;

import java.util.Objects;

@Embeddable
public class ReponseQuestionId implements java.io.Serializable {
    private static final long serialVersionUID = -1384360184907625561L;
    @Column(name = "ID_REPONSE_EVALUATION", nullable = false)
    private Long idReponseEvaluation;

    @Column(name = "ID_QUESTION_EVALUATION", nullable = false)
    private Long idQuestionEvaluation;

    public ReponseQuestionId() {
    }

    public ReponseQuestionId(Long idReponseEvaluation, Long idQuestionEvaluation) {
        this.idReponseEvaluation = idReponseEvaluation;
        this.idQuestionEvaluation = idQuestionEvaluation;
    }

    public Long getIdReponseEvaluation() {
        return idReponseEvaluation;
    }

    public void setIdReponseEvaluation(Long idReponseEvaluation) {
        this.idReponseEvaluation = idReponseEvaluation;
    }

    public Long getIdQuestionEvaluation() {
        return idQuestionEvaluation;
    }

    public void setIdQuestionEvaluation(Long idQuestionEvaluation) {
        this.idQuestionEvaluation = idQuestionEvaluation;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        ReponseQuestionId entity = (ReponseQuestionId) o;
        return Objects.equals(this.idReponseEvaluation, entity.idReponseEvaluation) &&
                Objects.equals(this.idQuestionEvaluation, entity.idQuestionEvaluation);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idReponseEvaluation, idQuestionEvaluation);
    }

}