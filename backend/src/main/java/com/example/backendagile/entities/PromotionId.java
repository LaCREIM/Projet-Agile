package com.example.backendagile.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import org.hibernate.Hibernate;

import java.util.Objects;

@Embeddable
public class PromotionId implements java.io.Serializable {
    private static final long serialVersionUID = -3770408658719747761L;
    @Column(name = "ANNEE_UNIVERSITAIRE", nullable = false, length = 10)
    private String anneeUniversitaire;

    @Column(name = "CODE_FORMATION", nullable = false, length = 8)
    private String codeFormation;

    public String getAnneeUniversitaire() {
        return anneeUniversitaire;
    }

    public void setAnneeUniversitaire(String anneeUniversitaire) {
        this.anneeUniversitaire = anneeUniversitaire;
    }

    public String getCodeFormation() {
        return codeFormation;
    }

    public void setCodeFormation(String codeFormation) {
        this.codeFormation = codeFormation;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        PromotionId entity = (PromotionId) o;
        return Objects.equals(this.anneeUniversitaire, entity.anneeUniversitaire) &&
                Objects.equals(this.codeFormation, entity.codeFormation);
    }

    @Override
    public int hashCode() {
        return Objects.hash(anneeUniversitaire, codeFormation);
    }

}