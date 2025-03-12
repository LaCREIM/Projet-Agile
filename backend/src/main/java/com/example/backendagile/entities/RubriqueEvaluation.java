package com.example.backendagile.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "RUBRIQUE_EVALUATION", schema = "DOSI_DEV", indexes = {
        @Index(name = "REV_EVE_FK_I", columnList = "ID_EVALUATION"),
        @Index(name = "REV_RUB_FK_I", columnList = "ID_RUBRIQUE")
})
public class RubriqueEvaluation {
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "rev_seq_generator")
    @SequenceGenerator(name = "rev_seq_generator", sequenceName = "REV_SEQ", allocationSize = 1)
    @Id
    @Column(name = "ID_RUBRIQUE_EVALUATION", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_EVALUATION", nullable = false)
    private Evaluation idEvaluation;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_RUBRIQUE")
    private Rubrique idRubrique;

    @Column(name = "ORDRE", nullable = false)
    private Short ordre;

    @Column(name = "DESIGNATION", length = 64)
    private String designation;
    @OneToMany(mappedBy = "idRubriqueEvaluation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<QuestionEvaluation> questions;

}