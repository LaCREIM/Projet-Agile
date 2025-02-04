package com.example.backendagile.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;

@Entity
@Table(name = "CANDIDAT", schema = "DOSI_DEV", indexes = {
        @Index(name = "CAN_PRO_FK_I", columnList = "ANNEE_UNIVERSITAIRE")
})
public class Candidat {
    @Id
    @Column(name = "NO_CANDIDAT", nullable = false, length = 50)
    private String noCandidat;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    private com.example.backendagile.entities.Promotion promotion;

    @Column(name = "NOM", nullable = false, length = 50)
    private String nom;

    @Column(name = "PRENOM", nullable = false, length = 50)
    private String prenom;

    @Column(name = "SEXE", nullable = false, length = 1)
    private String sexe;

    @Column(name = "DATE_NAISSANCE", nullable = false)
    private LocalDate dateNaissance;

    @Column(name = "LIEU_NAISSANCE", nullable = false)
    private String lieuNaissance;

    @ColumnDefault("'Fran���aise'")
    @Column(name = "NATIONALITE", nullable = false, length = 50)
    private String nationalite;

    @Column(name = "TELEPHONE", length = 20)
    private String telephone;

    @Column(name = "MOBILE", length = 20)
    private String mobile;

    @Column(name = "EMAIL", nullable = false)
    private String email;

    @Column(name = "ADRESSE", nullable = false)
    private String adresse;

    @Column(name = "CODE_POSTAL", length = 10)
    private String codePostal;

    @Column(name = "VILLE", nullable = false)
    private String ville;

    @Column(name = "PAYS_ORIGINE", nullable = false, length = 5)
    private String paysOrigine;

    @Column(name = "UNIVERSITE_ORIGINE", nullable = false, length = 6)
    private String universiteOrigine;

    @Column(name = "LISTE_SELECTION", length = 6)
    private String listeSelection;

    @Column(name = "SELECTION_NO_ORDRE")
    private Long selectionNoOrdre;

    @Convert(disableConversion = true)
    @Column(name = "CONFIRMATION_CANDIDAT")
    private Boolean confirmationCandidat;

    @Column(name = "DATE_REPONSE_CANDIDAT")
    private LocalDate dateReponseCandidat;

    public String getNoCandidat() {
        return noCandidat;
    }

    public void setNoCandidat(String noCandidat) {
        this.noCandidat = noCandidat;
    }

    public com.example.backendagile.entities.Promotion getPromotion() {
        return promotion;
    }

    public void setPromotion(com.example.backendagile.entities.Promotion promotion) {
        this.promotion = promotion;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getSexe() {
        return sexe;
    }

    public void setSexe(String sexe) {
        this.sexe = sexe;
    }

    public LocalDate getDateNaissance() {
        return dateNaissance;
    }

    public void setDateNaissance(LocalDate dateNaissance) {
        this.dateNaissance = dateNaissance;
    }

    public String getLieuNaissance() {
        return lieuNaissance;
    }

    public void setLieuNaissance(String lieuNaissance) {
        this.lieuNaissance = lieuNaissance;
    }

    public String getNationalite() {
        return nationalite;
    }

    public void setNationalite(String nationalite) {
        this.nationalite = nationalite;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getCodePostal() {
        return codePostal;
    }

    public void setCodePostal(String codePostal) {
        this.codePostal = codePostal;
    }

    public String getVille() {
        return ville;
    }

    public void setVille(String ville) {
        this.ville = ville;
    }

    public String getPaysOrigine() {
        return paysOrigine;
    }

    public void setPaysOrigine(String paysOrigine) {
        this.paysOrigine = paysOrigine;
    }

    public String getUniversiteOrigine() {
        return universiteOrigine;
    }

    public void setUniversiteOrigine(String universiteOrigine) {
        this.universiteOrigine = universiteOrigine;
    }

    public String getListeSelection() {
        return listeSelection;
    }

    public void setListeSelection(String listeSelection) {
        this.listeSelection = listeSelection;
    }

    public Long getSelectionNoOrdre() {
        return selectionNoOrdre;
    }

    public void setSelectionNoOrdre(Long selectionNoOrdre) {
        this.selectionNoOrdre = selectionNoOrdre;
    }

    public Boolean getConfirmationCandidat() {
        return confirmationCandidat;
    }

    public void setConfirmationCandidat(Boolean confirmationCandidat) {
        this.confirmationCandidat = confirmationCandidat;
    }

    public LocalDate getDateReponseCandidat() {
        return dateReponseCandidat;
    }

    public void setDateReponseCandidat(LocalDate dateReponseCandidat) {
        this.dateReponseCandidat = dateReponseCandidat;
    }

}