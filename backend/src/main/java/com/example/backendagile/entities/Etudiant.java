package com.example.backendagile.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

//import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDate;

@Entity 
@Table(name = "ETUDIANT", schema = "DOSI_DEV", indexes = {
        @Index(name = "ETU_PRO_FK_I", columnList = "ANNEE_UNIVERSITAIRE")
})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Etudiant {
    @Id
    @Column(name = "NO_ETUDIANT", nullable = false, length = 50)
    private String noEtudiant;

    @ManyToOne(fetch = FetchType.LAZY,cascade = CascadeType.ALL, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumns({
        @JoinColumn(name = "CODE_FORMATION", referencedColumnName = "CODE_FORMATION"),
        @JoinColumn(name = "ANNEE_UNIVERSITAIRE", referencedColumnName = "ANNEE_UNIVERSITAIRE")
    })
    private Promotion promotion;

   
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

    @Column(name = "EMAIL_UBO")
    private String emailUbo;

    @Column(name = "ADRESSE", nullable = false)
    private String adresse;

    @Column(name = "CODE_POSTAL", length = 10)
    private String codePostal;

    @Column(name = "VILLE")
    private String ville;

    @Column(name = "PAYS_ORIGINE", nullable = false, length = 5)
    private String paysOrigine;

    @Column(name = "UNIVERSITE_ORIGINE", nullable = false, length = 6)
    private String universiteOrigine;

    @Column(name = "GROUPE_TP")
    private Long groupeTp;

    @Column(name = "GROUPE_ANGLAIS")
    private Long groupeAnglais;

    public String getNoEtudiant() {
        return noEtudiant;
    }

    public void setNoEtudiant(String noEtudiant) {
        this.noEtudiant = noEtudiant;
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

    public String getEmailUbo() {
        return emailUbo;
    }

    public void setEmailUbo(String emailUbo) {
        this.emailUbo = emailUbo;
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

    public Long getGroupeTp() {
        return groupeTp;
    }

    public void setGroupeTp(Long groupeTp) {
        this.groupeTp = groupeTp;
    }

    public Long getGroupeAnglais() {
        return groupeAnglais;
    }

    public void setGroupeAnglais(Long groupeAnglais) {
        this.groupeAnglais = groupeAnglais;
    }
    public String getCodeFormation() {
        return (promotion != null) ? promotion.getCodeFormation() : null;
    }
    
    public String getAnneeUniversitaire() {
        return (promotion != null) ? promotion.getAnneeUniversitaire() : null;
    }

  
    
    

}