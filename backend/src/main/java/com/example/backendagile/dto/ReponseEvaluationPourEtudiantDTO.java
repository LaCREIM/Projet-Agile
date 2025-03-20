package com.example.backendagile.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

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

    private static final String KEY = "MySuperSecretKey123"; // 16-byte alphanumeric key

    // Helper method to convert byte array to hex string
    private static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b)); // Converts to 2-digit hex
        }
        return sb.toString();
    }

    // Helper method to convert hex string to byte array
    private static byte[] hexToBytes(String hex) {
        int length = hex.length();
        byte[] bytes = new byte[length / 2];
        for (int i = 0; i < length; i += 2) {
            bytes[i / 2] = (byte) ((Character.digit(hex.charAt(i), 16) << 4)
                    + Character.digit(hex.charAt(i + 1), 16));
        }
        return bytes;
    }

    // XOR encryption
    public void encryptIdEtudiant(String noEtudiant) {
        byte[] keyBytes = KEY.getBytes();
        byte[] noEtudiantBytes = noEtudiant.getBytes();
        byte[] encryptedBytes = new byte[noEtudiantBytes.length];

        for (int i = 0; i < noEtudiantBytes.length; i++) {
            encryptedBytes[i] = (byte) (noEtudiantBytes[i] ^ keyBytes[i % keyBytes.length]);
        }

        this.idEtudiant = bytesToHex(encryptedBytes); // Store as hex
    }

    // XOR decryption
    public static String decryptIdEtudiant(String idEtudiant) {
        byte[] keyBytes = KEY.getBytes();
        byte[] encryptedBytes = hexToBytes(idEtudiant);
        byte[] decryptedBytes = new byte[encryptedBytes.length];

        for (int i = 0; i < encryptedBytes.length; i++) {
            decryptedBytes[i] = (byte) (encryptedBytes[i] ^ keyBytes[i % keyBytes.length]);
        }

        return new String(decryptedBytes);
    }
}