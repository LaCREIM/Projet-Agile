package com.example.backendagile.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "QUALIFICATIF", schema = "DOSI_DEV")
public class Qualificatif {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "qua_seq_generator")
    @SequenceGenerator(name = "qua_seq_generator", sequenceName = "QUA_SEQ", allocationSize = 1)
    @Column(name = "ID_QUALIFICATIF", nullable = false)
    private Long id;
    
    @Column(name = "MAXIMAL", nullable = false, length = 16)
    private String maximal;

    @Column(name = "MINIMAL", nullable = false, length = 16)
    private String minimal;

}