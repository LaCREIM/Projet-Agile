package com.example.backendagile.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "PROMOTION", schema = "DOSI_DEV", indexes = {
        @Index(name = "PRO_ENS_FK_I", columnList = "NO_ENSEIGNANT")
})
public class Promotion {
    @EmbeddedId
    private PromotionId id;


    @Column(name = "NO_ENSEIGNANT", length = 5)
    @JsonIgnore
    private Long noEnseignant;



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

    public Long getNoEnseignant() {
        return noEnseignant;
    }

    public void setNoEnseignant(Long noEnseignant) {
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