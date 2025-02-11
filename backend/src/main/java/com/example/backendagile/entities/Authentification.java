package com.example.backendagile.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Setter
@Getter
@Entity
@Table(name = "AUTHENTIFICATION", schema = "DOSI_DEV")
public class Authentification {
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "aut_seq_generator")
    @SequenceGenerator(name = "aut_seq_generator", sequenceName = "AUT_SEQ", allocationSize = 1)
    @Id
    @Column(name = "ID_CONNECTION", nullable = false)
    private Long id;

    @Column(name = "ROLE", nullable = false, length = 5)
    private String role;

    @Column(name = "LOGIN_CONNECTION", nullable = false, length = 64)
    private String loginConnection;

    @Column(name = "PSEUDO_CONNECTION", length = 240)
    private String pseudoConnection;

    @Column(name = "MOT_PASSE", length = 240)
    private String motPasse;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "NO_ENSEIGNANT")
    private com.example.backendagile.entities.Enseignant noEnseignant;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "NO_ETUDIANT")
    private com.example.backendagile.entities.Etudiant noEtudiant;

}