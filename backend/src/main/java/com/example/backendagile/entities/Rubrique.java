package com.example.backendagile.entities;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Setter
@Getter
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

    public Rubrique() {
    }

}