package com.example.backendagile.dto;


import lombok.Data;

import java.time.LocalDate;
@Data
public class EtudiantDTO {
    private String noEtudiant;
    private String nom;
    private String prenom;
    private String sexe;
    private LocalDate dateNaissance;
    private String lieuNaissance;
    private String nationalite;
    private String telephone;
    private String mobile;
    private String email;
    private String emailUbo;
    private String adresse;
    private String codePostal;
    private String ville;
    private String paysOrigine;
    private String universiteOrigine;
    private Long groupeTp;
    private Long groupeAnglais;
    private String password;
}
