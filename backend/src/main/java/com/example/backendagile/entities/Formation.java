package com.example.backendagile.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "FORMATION", schema = "DOSI_DEV")
public class Formation {
    @Id
    @Column(name = "CODE_FORMATION", nullable = false, length = 8)
    private String codeFormation;

    @Column(name = "DIPLOME", nullable = false, length = 3)
    private String diplome;

    @ColumnDefault("1")
    @Convert(disableConversion = true)
    @Column(name = "N0_ANNEE", nullable = false)
    private Boolean n0Annee = false;

    @Column(name = "NOM_FORMATION", nullable = false, length = 64)
    private String nomFormation;

    public Formation(String codeFormation) {
        this.codeFormation = codeFormation;
    }

    @Convert(disableConversion = true)
    @Column(name = "DOUBLE_DIPLOME", nullable = false)
    private Boolean doubleDiplome = false;

    @Column(name = "DEBUT_ACCREDITATION")
    private LocalDate debutAccreditation;

    @Column(name = "FIN_ACCREDITATION")
    private LocalDate finAccreditation;

    public Formation() {

    }

    public String getCodeFormation() {
        return codeFormation;
    }

    public void setCodeFormation(String codeFormation) {
        this.codeFormation = codeFormation;
    }

    public String getDiplome() {
        return diplome;
    }

    public void setDiplome(String diplome) {
        this.diplome = diplome;
    }

    public Boolean getN0Annee() {
        return n0Annee;
    }

    public void setN0Annee(Boolean n0Annee) {
        this.n0Annee = n0Annee;
    }

    public String getNomFormation() {
        return nomFormation;
    }

    public void setNomFormation(String nomFormation) {
        this.nomFormation = nomFormation;
    }

    public Boolean getDoubleDiplome() {
        return doubleDiplome;
    }

    public void setDoubleDiplome(Boolean doubleDiplome) {
        this.doubleDiplome = doubleDiplome;
    }

    public LocalDate getDebutAccreditation() {
        return debutAccreditation;
    }

    public void setDebutAccreditation(LocalDate debutAccreditation) {
        this.debutAccreditation = debutAccreditation;
    }

    public LocalDate getFinAccreditation() {
        return finAccreditation;
    }

    public void setFinAccreditation(LocalDate finAccreditation) {
        this.finAccreditation = finAccreditation;
    }

}