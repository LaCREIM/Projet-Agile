package com.example.backendagile.dto;

public class QualificatifDTO {
    private String maximal;
    private String minimal;


    public QualificatifDTO() {
    }

    public QualificatifDTO(String minimal, String maximal) {
        this.maximal = maximal;
        this.minimal = minimal;
    }
    public String getMaximal() {
        return maximal;
    }

    public void setMaximal(String maximal) {
        this.maximal = maximal;
    }

    public String getMinimal() {
        return minimal;
    }

    public void setMinimal(String minimal) {
        this.minimal = minimal;
    }
}