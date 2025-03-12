package com.example.backendagile.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "UNITE_ENSEIGNEMENT", schema = "DOSI_DEV", indexes = {
        @Index(name = "UE_FRM_FK_I", columnList = "CODE_FORMATION"),
        @Index(name = "UE_ENS_FK_I", columnList = "NO_ENSEIGNANT")
})
public class UniteEnseignement {
    @EmbeddedId
    private UniteEnseignementId id;

    @MapsId("codeFormation")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "CODE_FORMATION", nullable = false)
    private Formation codeFormation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "NO_ENSEIGNANT", nullable = false)
    private Enseignant noEnseignant;

    @Column(name = "DESIGNATION", nullable = false, length = 64)
    private String designation;

    @Column(name = "SEMESTRE", nullable = false, length = 3)
    private String semestre;

    @Column(name = "DESCRIPTION", length = 256)
    private String description;

    @Column(name = "NBH_CM")
    private Long nbhCm;

    @Column(name = "NBH_TD")
    private Short nbhTd;

    @Column(name = "NBH_TP")
    private Short nbhTp;

    public UniteEnseignementId getId() {
        return id;
    }

    public void setId(UniteEnseignementId id) {
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

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getSemestre() {
        return semestre;
    }

    public void setSemestre(String semestre) {
        this.semestre = semestre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getNbhCm() {
        return nbhCm;
    }

    public void setNbhCm(Long nbhCm) {
        this.nbhCm = nbhCm;
    }

    public Short getNbhTd() {
        return nbhTd;
    }

    public void setNbhTd(Short nbhTd) {
        this.nbhTd = nbhTd;
    }

    public Short getNbhTp() {
        return nbhTp;
    }

    public void setNbhTp(Short nbhTp) {
        this.nbhTp = nbhTp;
    }


    @Override
    public String toString() {
        return "UniteEnseignement{" +
                "id=" + id +
                ", designation='" + designation + '\'' +
                ", semestre='" + semestre + '\'' +
                ", description='" + description + '\'' +
                ", nbhCm=" + nbhCm +
                ", nbhTd=" + nbhTd +
                ", nbhTp=" + nbhTp +
                '}';
    }
}