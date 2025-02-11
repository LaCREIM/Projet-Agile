package com.example.backendagile.dto;


import java.time.LocalDate;


public class PromotionDTO {

    private String anneeUniversitaire;

    private String siglePromotion;

    private Short nbMaxEtudiant;

    private LocalDate dateReponseLp;

    private LocalDate dateReponseLalp;

    private LocalDate dateRentree;

    private String lieuRentree;

    private String processusStage;

    private String commentaire;

    private String codeFormation;

    private String nomFormation;

    private String emailEnseignant;

    private String diplome;

    private Long noEnseignant;

    private String type;

    private String nom;

    private String prenom;

//Default constructor
public PromotionDTO() {
    this.anneeUniversitaire = "";
    this.siglePromotion = "";
    this.nbMaxEtudiant = 0;
    this.dateReponseLp = LocalDate.MIN;
    this.dateReponseLalp = LocalDate.MIN;
    this.dateRentree = LocalDate.MIN;
    this.lieuRentree = "";
    this.processusStage = "";
    this.commentaire = "";
    this.codeFormation = "";
    this.diplome = "";
    this.noEnseignant = 0L;
    this.type = "";
    this.nom = "";
    this.prenom = "";
    this.nomFormation = "";
    this.emailEnseignant = "";
}

// Getter and Setter


    public String getNomFormation() {
        return nomFormation;
    }

    public void setNomFormation(String nomFormation) {
        this.nomFormation = nomFormation;
    }

    public String getEmailEnseignant() {
        return emailEnseignant;
    }

    public void setEmailEnseignant(String emailEnseignant) {
        this.emailEnseignant = emailEnseignant;
    }

    public LocalDate getDateReponseLp() {
        return dateReponseLp;
    }

    public void setDateReponseLp(LocalDate dateReponseLp) {
        this.dateReponseLp = dateReponseLp;
    }

    public LocalDate getDateReponseLalp() {
        return dateReponseLalp;
    }

    public void setDateReponseLalp(LocalDate dateReponseLalp) {
        this.dateReponseLalp = dateReponseLalp;
    }

    public void setDateRentree(LocalDate dateRentree) {
        this.dateRentree = dateRentree;
    }

    public String getProcessusStage() {
        return processusStage;
    }

    public void setProcessusStage(String processusStage) {
        this.processusStage = processusStage;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }
    public Long getNoEnseignant() {
        return noEnseignant;
    }

    public void setNoEnseignant(Long noEnseignant) {
        this.noEnseignant = noEnseignant;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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

    public String getAnneeUniversitaire() {
        return anneeUniversitaire;
    }

    public void setAnneeUniversitaire(String anneeUniversitaire) {
        this.anneeUniversitaire = anneeUniversitaire;
    }


    public String getSiglePromotion() {
        return siglePromotion;
    }

    public void setSiglePromotion(String siglePromotion) {
        this.siglePromotion = siglePromotion;
    }

    public Short getNbMaxEtudiant() {
        return nbMaxEtudiant;
    }

    public void setNbMaxEtudiant(Short nbMaxEtudiant) {
        this.nbMaxEtudiant = nbMaxEtudiant;
    }

    public LocalDate getDateRentree() {
        return dateRentree;
    }

    public String getLieuRentree() {
        return lieuRentree;
    }

    public void setLieuRentree(String lieuRentree) {
        this.lieuRentree = lieuRentree;
    }

    @Override
    public String toString() {
        return "Promotion{" +
                "anneePro=" + anneeUniversitaire +
                ", siglePro='" + siglePromotion + '\'' +
                ", nbEtuSouhaite=" + nbMaxEtudiant +
                ", dateRentree=" + dateRentree +
                ", lieuRentree='" + lieuRentree + '\'' +
                '}';
    }
}