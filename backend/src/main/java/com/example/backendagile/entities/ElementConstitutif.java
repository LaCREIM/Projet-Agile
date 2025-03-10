package com.example.backendagile.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "ELEMENT_CONSTITUTIF", schema = "DOSI_DEV", indexes = {
        @Index(name = "EC_UE_FK_I", columnList = "CODE_FORMATION, CODE_UE"),
        @Index(name = "EC_ENS_FK_I", columnList = "NO_ENSEIGNANT")
})
public class ElementConstitutif {
    @EmbeddedId
    private ElementConstitutifId id;

    @MapsId
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @JoinColumns({
            @JoinColumn(name = "CODE_FORMATION", referencedColumnName = "CODE_FORMATION"),
            @JoinColumn(name = "CODE_UE", referencedColumnName = "CODE_UE")
    })
    @OnDelete(action = OnDeleteAction.RESTRICT)
    private com.example.backendagile.entities.UniteEnseignement uniteEnseignement;


    @Column(name = "CODE_EC", nullable = false)
    private String codeEc;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "NO_ENSEIGNANT", nullable = false)
    private com.example.backendagile.entities.Enseignant noEnseignant;

    @Column(name = "DESIGNATION", nullable = false, length = 64)
    private String designation;

    @Column(name = "DESCRIPTION", length = 240)
    private String description;

    @Column(name = "NBH_CM")
    private Short nbhCm;

    @Column(name = "NBH_TD")
    private Short nbhTd;

    @Column(name = "NBH_TP")
    private Short nbhTp;

    public ElementConstitutifId getId() {
        return id;
    }

    public void setId(ElementConstitutifId id) {
        this.id = id;
    }

    public com.example.backendagile.entities.UniteEnseignement getUniteEnseignement() {
        return uniteEnseignement;
    }

    public void setUniteEnseignement(com.example.backendagile.entities.UniteEnseignement uniteEnseignement) {
        this.uniteEnseignement = uniteEnseignement;
    }

    public com.example.backendagile.entities.Enseignant getNoEnseignant() {
        return noEnseignant;
    }

    public void setNoEnseignant(com.example.backendagile.entities.Enseignant noEnseignant) {
        this.noEnseignant = noEnseignant;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Short getNbhCm() {
        return nbhCm;
    }

    public void setNbhCm(Short nbhCm) {
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

    public String getCodeEc() {
        return codeEc;
    }
    public void setCodeEc(String codeEc) {
        this.codeEc = codeEc;
    }

}