package com.example.backendagile.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "QUESTION", schema = "DOSI_DEV", indexes = {
        @Index(name = "QUE_ENS_FK_I", columnList = "NO_ENSEIGNANT"),
        @Index(name = "QUE_QUA_FK_I", columnList = "ID_QUALIFICATIF")
})
public class Question {
    @Id
    @Column(name = "ID_QUESTION", nullable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "qst_seq_generator")
    @SequenceGenerator(name = "qst_seq_generator", sequenceName = "QUE_SEQ", allocationSize = 1)
    private Long id;

    @Column(name = "TYPE", nullable = false, length = 10)
    private String type;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @JoinColumn(name = "NO_ENSEIGNANT")
    private Enseignant noEnseignant;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_QUALIFICATIF", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Qualificatif idQualificatif;

    @Column(name = "INTITULE", nullable = false, length = 64)
    private String intitule;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Enseignant getNoEnseignant() {
        return noEnseignant;
    }

    public void setNoEnseignant(Enseignant noEnseignant) {
        this.noEnseignant = noEnseignant;
    }

    public Qualificatif getIdQualificatif() {
        return idQualificatif;
    }

    public void setIdQualificatif(Qualificatif idQualificatif) {
        this.idQualificatif = idQualificatif;
    }

    public String getIntitule() {
        return intitule;
    }

    public void setIntitule(String intitule) {
        this.intitule = intitule;
    }

}