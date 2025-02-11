package com.example.backendagile.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "RUBRIQUE", schema = "DOSI_DEV", indexes = {
        @Index(name = "RUB_ENS_FK_I", columnList = "NO_ENSEIGNANT")
})
public class Rubrique {
    @Id
    @Column(name = "ID_RUBRIQUE", nullable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "rub_seq_generator")
    @SequenceGenerator(name = "rub_seq_generator", sequenceName = "RUB_SEQ", allocationSize = 1)
    private Long id;

    @Column(name = "TYPE", nullable = false, length = 10)
    private String type;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "NO_ENSEIGNANT")
    private Enseignant noEnseignant;

    @Column(name = "DESIGNATION", nullable = false, length = 32)
    private String designation;

    @Column(name = "ORDRE")
    private Long ordre;

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

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public Long getOrdre() {
        return ordre;
    }

    public void setOrdre(Long ordre) {
        this.ordre = ordre;
    }

}