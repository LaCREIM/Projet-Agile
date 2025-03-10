package com.example.backendagile.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "DROIT", schema = "DOSI_DEV", indexes = {
        @Index(name = "DRT_EVE_FK_I", columnList = "ID_EVALUATION"),
        @Index(name = "DRT_ENS_FK_I", columnList = "NO_ENSEIGNANT")
}, uniqueConstraints = {
        @UniqueConstraint(name = "DRT_DRT_UK", columnNames = {"ID_EVALUATION", "NO_ENSEIGNANT"})
})
public class Droit {
    @EmbeddedId
    private DroitId id;

    @MapsId("idEvaluation")
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_EVALUATION", nullable = false)
    private com.example.backendagile.entities.Evaluation idEvaluation;

    @MapsId("noEnseignant")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "NO_ENSEIGNANT", nullable = false)
    private com.example.backendagile.entities.Enseignant noEnseignant;

    @Convert(disableConversion = true)
    @Column(name = "CONSULTATION", nullable = false)
    private char consultation;

    @Convert(disableConversion = true)
    @Column(name = "DUPLICATION", nullable = false)
    private char duplication;

    public DroitId getId() {
        return id;
    }

    public void setId(DroitId id) {
        this.id = id;
    }

    public com.example.backendagile.entities.Evaluation getIdEvaluation() {
        return idEvaluation;
    }

    public void setIdEvaluation(com.example.backendagile.entities.Evaluation idEvaluation) {
        this.idEvaluation = idEvaluation;
    }

    public com.example.backendagile.entities.Enseignant getNoEnseignant() {
        return noEnseignant;
    }

    public void setNoEnseignant(com.example.backendagile.entities.Enseignant noEnseignant) {
        this.noEnseignant = noEnseignant;
    }

    public char getConsultation() {
        return consultation;
    }

    public void setConsultation(char consultation) {
        this.consultation = consultation;
    }

    public char getDuplication() {
        return duplication;
    }

    public void setDuplication(char duplication) {
        this.duplication = duplication;
    }

    @Override
    public String toString() {
        return "Droit{" +
                "id= {" + id.getIdEvaluation() + " , " + id.getNoEnseignant() + " }" +
                ", idEvaluation=" + idEvaluation.getId() +
                ", noEnseignant=" + noEnseignant.getId() +
                ", consultation=" + consultation +
                ", duplication=" + duplication +
                '}';
    }
}