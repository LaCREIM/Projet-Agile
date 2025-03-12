package com.example.backendagile.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Setter
@Getter
@Entity
@Table(name = "QUESTION_EVALUATION", schema = "DOSI_DEV", indexes = {
        @Index(name = "QEV_REV_FK_I", columnList = "ID_RUBRIQUE_EVALUATION"),
        @Index(name = "QEV_QUE_FK_I", columnList = "ID_QUESTION"),
        @Index(name = "QEV_QUA_FK_I", columnList = "ID_QUALIFICATIF")
})
public class QuestionEvaluation {
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "question_evaluation_seq_generator")
    @SequenceGenerator(name = "question_evaluation_seq_generator", sequenceName = "QEV_SEQ", allocationSize = 1)
    @Id
    @Column(name = "ID_QUESTION_EVALUATION", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_RUBRIQUE_EVALUATION", nullable = false)
    private com.example.backendagile.entities.RubriqueEvaluation idRubriqueEvaluation;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_QUESTION")
    private Question idQuestion;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_QUALIFICATIF")
    private Qualificatif idQualificatif;

    @Column(name = "ORDRE", nullable = false)
    private Short ordre;

    @Column(name = "INTITULE", length = 64)
    private String intitule;


}