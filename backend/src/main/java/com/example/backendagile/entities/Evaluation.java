package com.example.backendagile.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;

@Entity
@Table(name = "EVALUATION", schema = "DOSI_DEV", indexes = {
        @Index(name = "EVE_ENS_FK_I", columnList = "NO_ENSEIGNANT"),
        @Index(name = "EVE_UE_FK_I", columnList = "CODE_FORMATION, CODE_UE"),
        @Index(name = "EVE_PRO_FK_I", columnList = "ANNEE_UNIVERSITAIRE"),
        @Index(name = "EVE_EC_FK_I", columnList = "CODE_EC")
}, uniqueConstraints = {
        @UniqueConstraint(name = "EVE_EVE_UK", columnNames = {"ANNEE_UNIVERSITAIRE", "NO_ENSEIGNANT", "NO_EVALUATION", "CODE_FORMATION", "CODE_UE"})
})
public class Evaluation {
    @Id
    @Column(name = "ID_EVALUATION", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "NO_ENSEIGNANT", nullable = false)
    private Enseignant noEnseignant;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    private ElementConstitutif elementConstitutif;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    private com.example.backendagile.entities.Promotion promotion;

    @Column(name = "NO_EVALUATION", nullable = false)
    private Short noEvaluation;

    @Column(name = "DESIGNATION", nullable = false, length = 16)
    private String designation;

    @ColumnDefault("'ELA'")
    @Column(name = "ETAT", nullable = false, length = 3)
    private String etat;

    @Column(name = "PERIODE", length = 64)
    private String periode;

    @Column(name = "DEBUT_REPONSE", nullable = false)
    private LocalDate debutReponse;

    @Column(name = "FIN_REPONSE", nullable = false)
    private LocalDate finReponse;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Enseignant getNoEnseignant() {
        return noEnseignant;
    }

    public void setNoEnseignant(Enseignant noEnseignant) {
        this.noEnseignant = noEnseignant;
    }

    public ElementConstitutif getElementConstitutif() {
        return elementConstitutif;
    }

    public void setElementConstitutif(ElementConstitutif elementConstitutif) {
        this.elementConstitutif = elementConstitutif;
    }

    public com.example.backendagile.entities.Promotion getPromotion() {
        return promotion;
    }

    public void setPromotion(com.example.backendagile.entities.Promotion promotion) {
        this.promotion = promotion;
    }

    public Short getNoEvaluation() {
        return noEvaluation;
    }

    public void setNoEvaluation(Short noEvaluation) {
        this.noEvaluation = noEvaluation;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getEtat() {
        return etat;
    }

    public void setEtat(String etat) {
        this.etat = etat;
    }

    public String getPeriode() {
        return periode;
    }

    public void setPeriode(String periode) {
        this.periode = periode;
    }

    public LocalDate getDebutReponse() {
        return debutReponse;
    }

    public void setDebutReponse(LocalDate debutReponse) {
        this.debutReponse = debutReponse;
    }

    public LocalDate getFinReponse() {
        return finReponse;
    }

    public void setFinReponse(LocalDate finReponse) {
        this.finReponse = finReponse;
    }

}