package com.example.backendagile.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Setter
@Getter
@Entity
@Table(name = "REPONSE_EVALUATION", schema = "DOSI_DEV", indexes = {
        @Index(name = "RPE_EVE_FK_I", columnList = "ID_EVALUATION"),
        @Index(name = "RPE_ETU_FK_I", columnList = "NO_ETUDIANT")
})
public class ReponseEvaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "rpe_seq_generator")
    @SequenceGenerator(name = "rpe_seq_generator", sequenceName = "RPE_SEQ", allocationSize = 1)
    @Column(name = "ID_REPONSE_EVALUATION", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_EVALUATION", nullable = false)
    private Evaluation idEvaluation;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "NO_ETUDIANT")
    private Etudiant noEtudiant;

    @Column(name = "COMMENTAIRE", length = 512)
    private String commentaire;

    @Column(name = "NOM", length = 32)
    private String nom;

    @Column(name = "PRENOM", length = 32)
    private String prenom;

}