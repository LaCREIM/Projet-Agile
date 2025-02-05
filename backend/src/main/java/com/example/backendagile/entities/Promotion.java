package com.example.backendagile.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;

@Entity
@Table(name = "PROMOTION", schema = "DOSI_DEV", indexes = {
        @Index(name = "PRO_FRM_FK_I", columnList = "CODE_FORMATION"),
        @Index(name = "PRO_ENS_FK_I", columnList = "NO_ENSEIGNANT")
})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Promotion {
    @EmbeddedId
    private PromotionId id;

    @MapsId("codeFormation")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "CODE_FORMATION", nullable = false)
    @JsonIgnore
    private Formation codeFormation;

    @Column(name = "ANNEE_UNIVERSITAIRE", nullable = false, insertable = false, updatable = false)
    private String anneeUniversitaire;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "NO_ENSEIGNANT")
    private Enseignant noEnseignant;

    @Column(name = "SIGLE_PROMOTION", length = 16)
    private String siglePromotion;

    @Column(name = "NB_MAX_ETUDIANT", nullable = false)
    private Short nbMaxEtudiant;

    @Column(name = "DATE_REPONSE_LP")
    private LocalDate dateReponseLp;

    @Column(name = "DATE_REPONSE_LALP")
    private LocalDate dateReponseLalp;

    @Column(name = "DATE_RENTREE")
    private LocalDate dateRentree;

    @ColumnDefault("'LC117A'")
    @Column(name = "LIEU_RENTREE", length = 12)
    private String lieuRentree;

    @ColumnDefault("'RECH'")
    @Column(name = "PROCESSUS_STAGE", length = 5)
    private String processusStage;

    @Column(name = "COMMENTAIRE")
    private String commentaire;

    public PromotionId getId() {
        return id;
    }

    public void setId(PromotionId id) {
        this.id = id;
    }

    public Formation getCodeFormation() {
        return codeFormation;
    }

    public void setCodeFormation(Formation codeFormation) {
        this.codeFormation = codeFormation;
    }

    public Enseignant getNoEnseignant() {
        return noEnseignant;
    }

    public void setNoEnseignant(Enseignant noEnseignant) {
        this.noEnseignant = noEnseignant;
    }

    public String getSiglePromotion() {
        return siglePromotion;
    }

    public void setSiglePromotion(String siglePromotion) {
        this.siglePromotion = siglePromotion;
    }

    public Short getNbMaxEtudiant() {
        return nbMaxEtudiant;
    }

    public void setNbMaxEtudiant(Short nbMaxEtudiant) {
        this.nbMaxEtudiant = nbMaxEtudiant;
    }

    public LocalDate getDateReponseLp() {
        return dateReponseLp;
    }

    public void setDateReponseLp(LocalDate dateReponseLp) {
        this.dateReponseLp = dateReponseLp;
    }

    public LocalDate getDateReponseLalp() {
        return dateReponseLalp;
    }

    public void setDateReponseLalp(LocalDate dateReponseLalp) {
        this.dateReponseLalp = dateReponseLalp;
    }

    public LocalDate getDateRentree() {
        return dateRentree;
    }

    public void setDateRentree(LocalDate dateRentree) {
        this.dateRentree = dateRentree;
    }

    public String getLieuRentree() {
        return lieuRentree;
    }

    public void setLieuRentree(String lieuRentree) {
        this.lieuRentree = lieuRentree;
    }

    public String getProcessusStage() {
        return processusStage;
    }

    public void setProcessusStage(String processusStage) {
        this.processusStage = processusStage;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }

}