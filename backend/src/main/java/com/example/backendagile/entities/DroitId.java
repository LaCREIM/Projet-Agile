package com.example.backendagile.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import org.hibernate.Hibernate;

import java.util.Objects;

@Embeddable
public class DroitId implements java.io.Serializable {
    private static final long serialVersionUID = 6625926173837810731L;
    @Column(name = "ID_EVALUATION", nullable = false)
    private Long idEvaluation;

    @Column(name = "NO_ENSEIGNANT", nullable = false)
    private Long noEnseignant;

    public Long getIdEvaluation() {
        return idEvaluation;
    }

    public void setIdEvaluation(Long idEvaluation) {
        this.idEvaluation = idEvaluation;
    }

    public Long getNoEnseignant() {
        return noEnseignant;
    }

    public void setNoEnseignant(Long noEnseignant) {
        this.noEnseignant = noEnseignant;
    }

    public DroitId(Long idEvaluation, Long noEnseignant) {
        this.idEvaluation = idEvaluation;
        this.noEnseignant = noEnseignant;
    }

    public DroitId() {
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        DroitId entity = (DroitId) o;
        return Objects.equals(this.idEvaluation, entity.idEvaluation) &&
                Objects.equals(this.noEnseignant, entity.noEnseignant);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idEvaluation, noEnseignant);
    }

}