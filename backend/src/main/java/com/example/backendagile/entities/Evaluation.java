package com.example.backendagile.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "eve_seq_generator")
    @SequenceGenerator(name = "eve_seq_generator", sequenceName = "EVE_SEQ", allocationSize = 1)
    @Column(name = "ID_EVALUATION", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "NO_ENSEIGNANT", nullable = false)
    private Enseignant enseignant;

  /* @OnDelete(action = OnDeleteAction.RESTRICT)
@ManyToOne
@JoinColumns({
    @JoinColumn(name = "CODE_FORMATION", referencedColumnName = "CODE_FORMATION", columnDefinition = "CODE_FORM"),
    @JoinColumn(name = "CODE_UE", referencedColumnName = "CODE_UE", columnDefinition = "CODE_UE"),
    @JoinColumn(name = "CODE_EC", referencedColumnName = "CODE_EC", columnDefinition = "CODE_EC")

})
    private ElementConstitutif elementConstitutif; */ 

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

    @JoinColumns({
        @JoinColumn(name = "CODE_FORMATION", referencedColumnName = "CODE_FORMATION", insertable = false, updatable = false),
        @JoinColumn(name = "CODE_UE", referencedColumnName = "CODE_UE", insertable = false, updatable = false)
    })
    private UniteEnseignement uniteEnseignement;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@JoinColumns({
@JoinColumn(name = "CODE_FORMATION", referencedColumnName = "CODE_FORMATION",columnDefinition = "CODE_FORM"),
@JoinColumn(name = "ANNEE_UNIVERSITAIRE", referencedColumnName = "ANNEE_UNIVERSITAIRE",columnDefinition = "ANNEE_UNI")
})
    @OnDelete(action = OnDeleteAction.RESTRICT)
    private com.example.backendagile.entities.Promotion promotion;

    @Column(name = "CODE_FORMATION", nullable = false, insertable = false, updatable = false)
    private String codeFormation;    

    @Column(name = "ANNEE_UNIVERSITAIRE", nullable = false, insertable = false, updatable = false)
    private String anneeUniversitaire;
    
    @Column(name = "CODE_UE", nullable = false)
    private String codeUE;
    @Column(name = "CODE_EC")
    private String codeEC;

    @Column(name = "NO_EVALUATION", nullable = false)
    private Short noEvaluation;

    @Column(name = "DESIGNATION", nullable = false, length = 16)
    private String designation;

    @ColumnDefault("ELA")
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
 
public String getCodeFormation() {
        return codeFormation;
    }
    public void setCodeFormation(String codeFormation) {
        this.codeFormation = codeFormation;
    }
    public String getAnneeUniversitaire() {
        return anneeUniversitaire;
    }
    public void setAnneeUniversitaire(String anneeUniversitaire) {
        this.anneeUniversitaire = anneeUniversitaire;
    }
    public String getCodeUE() {
        return codeUE;
    }
    public void setCodeUE(String codeUE) {
        this.codeUE = codeUE;
    }
    public String getCodeEC() {
        return codeEC;
    }
    public void setCodeEC(String codeEC) {
        this.codeEC = codeEC;
    }
 

    public void setId(Long id) {
        this.id = id;
    }

    public Enseignant getEnseignant() {
        return enseignant;
    }

    public void setEnseignant(Enseignant noEnseignant) {
        this.enseignant = noEnseignant;
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

    public UniteEnseignement getUniteEnseignement() {
        return uniteEnseignement;
    }

    public LocalDate getFinReponse() {
        return finReponse;
    }

    public void setFinReponse(LocalDate finReponse) {
        this.finReponse = finReponse;
    }


    public Evaluation copy() {
        Evaluation copie = new Evaluation();
        copie.setEnseignant(this.getEnseignant());
        copie.setPromotion(this.getPromotion());
        copie.setNoEvaluation(this.getNoEvaluation());
        copie.setDesignation(this.getDesignation());
        copie.setEtat(this.getEtat());
        copie.setPeriode(this.getPeriode());
        copie.setDebutReponse(this.getDebutReponse());
        copie.setFinReponse(this.getFinReponse());
        copie.setCodeFormation(this.getCodeFormation());
        copie.setAnneeUniversitaire(this.getAnneeUniversitaire());
        copie.setCodeUE(this.getCodeUE());
        copie.setCodeEC(this.getCodeEC());
        // Ne pas copier l'ID, car il sera généré lors de l'insertion
        return copie;
    }

}