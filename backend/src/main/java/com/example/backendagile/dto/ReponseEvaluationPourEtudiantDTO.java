package com.example.backendagile.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReponseEvaluationPourEtudiantDTO {
    private Long idReponseEvaluation;
    private Long idEvaluation;
    private String commentaire;
    private String nomFormation;
    private String promotion;
    private String idEtudiant;


    // Generate a hashed ID for the student using NO_ETUDIANT
    public void generateHashedIdEtudiant(String noEtudiant) {
        try {
            // Create a MessageDigest instance for MD5
            MessageDigest md = MessageDigest.getInstance("MD5");

            // Hash the NO_ETUDIANT
            byte[] hashBytes = md.digest(noEtudiant.getBytes());

            // Convert the hash bytes to a hexadecimal string
            StringBuilder sb = new StringBuilder();
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }

            // Set the hashed ID as idEtudiant
            this.idEtudiant = sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("MD5 algorithm not found", e);
        }
    }
}