package com.example.backendagile.entities;

import jakarta.persistence.Column;
//import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.LocalDate;

//@Entity
@Table(name = "ENSEIGNANT_JN", schema = "DOSI_DEV")
public class EnseignantJn {
    @Column(name = "JN_OPERATION", nullable = false, length = 3)
    private String jnOperation;

    @Column(name = "JN_ORACLE_USER", nullable = false, length = 30)
    private String jnOracleUser;

    @Column(name = "JN_DATETIME", nullable = false)
    private LocalDate jnDatetime;

    @Column(name = "JN_NOTES", length = 240)
    private String jnNotes;

    @Column(name = "JN_APPLN", length = 35)
    private String jnAppln;

    @Column(name = "JN_SESSION")
    private Long jnSession;

    @Column(name = "NO_ENSEIGNANT", nullable = false)
    private Integer noEnseignant;

    @Column(name = "\"TYPE\"", length = 5)
    private String type;

    @Column(name = "SEXE", length = 1)
    private String sexe;

    @Column(name = "NOM", length = 50)
    private String nom;

    @Column(name = "PRENOM", length = 50)
    private String prenom;

    @Column(name = "ADRESSE")
    private String adresse;

    @Column(name = "CODE_POSTAL", length = 10)
    private String codePostal;

    @Column(name = "VILLE")
    private String ville;

    @Column(name = "PAYS", length = 5)
    private String pays;

    @Column(name = "MOBILE", length = 20)
    private String mobile;

    @Column(name = "TELEPHONE", length = 20)
    private String telephone;

    @Column(name = "EMAIL_UBO")
    private String emailUbo;

    @Column(name = "EMAIL_PERSO")
    private String emailPerso;

    public String getJnOperation() {
        return jnOperation;
    }

    public void setJnOperation(String jnOperation) {
        this.jnOperation = jnOperation;
    }

    public String getJnOracleUser() {
        return jnOracleUser;
    }

    public void setJnOracleUser(String jnOracleUser) {
        this.jnOracleUser = jnOracleUser;
    }

    public LocalDate getJnDatetime() {
        return jnDatetime;
    }

    public void setJnDatetime(LocalDate jnDatetime) {
        this.jnDatetime = jnDatetime;
    }

    public String getJnNotes() {
        return jnNotes;
    }

    public void setJnNotes(String jnNotes) {
        this.jnNotes = jnNotes;
    }

    public String getJnAppln() {
        return jnAppln;
    }

    public void setJnAppln(String jnAppln) {
        this.jnAppln = jnAppln;
    }

    public Long getJnSession() {
        return jnSession;
    }

    public void setJnSession(Long jnSession) {
        this.jnSession = jnSession;
    }

    public Integer getNoEnseignant() {
        return noEnseignant;
    }

    public void setNoEnseignant(Integer noEnseignant) {
        this.noEnseignant = noEnseignant;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getSexe() {
        return sexe;
    }

    public void setSexe(String sexe) {
        this.sexe = sexe;
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

    public String getPays() {
        return pays;
    }

    public void setPays(String pays) {
        this.pays = pays;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getEmailUbo() {
        return emailUbo;
    }

    public void setEmailUbo(String emailUbo) {
        this.emailUbo = emailUbo;
    }

    public String getEmailPerso() {
        return emailPerso;
    }

    public void setEmailPerso(String emailPerso) {
        this.emailPerso = emailPerso;
    }

}