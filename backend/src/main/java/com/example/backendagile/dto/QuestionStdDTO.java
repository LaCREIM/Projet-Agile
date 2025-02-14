package com.example.backendagile.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class QuestionStdDTO {
    private Long idQualificatif; 
    private String intitule;
    //@JsonIgnore
    String maxQualificatif;
   // @JsonIgnore
    String minQualificatif;

    public Long getIdQualificatif() {
        return idQualificatif;
    }

    public void setIdQualificatif(Long idQualificatif) {
        this.idQualificatif = idQualificatif;
    }

    public String getIntitule() {
        return intitule;
    }

    public void setIntitule(String intitule) {
        this.intitule = intitule;
    }

    public String getMaxQualificatif() {
        return maxQualificatif;
    }

    public String getMinQualificatif() {
        return minQualificatif;
    }

    public void setMaxQualificatif(String maxQualificatif) {
        this.maxQualificatif = maxQualificatif;
    }

    public void setMinQualificatif(String minQualificatif) {
        this.minQualificatif = minQualificatif;
    }
}



