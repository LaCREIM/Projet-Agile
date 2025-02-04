package com.example.backendagile.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "CG_REF_CODES", schema = "DOSI_DEV", indexes = {
        @Index(name = "CGRC_I", columnList = "RV_DOMAIN, RV_LOW_VALUE")
})
public class CgRefCode {
    @Id
    @Column(name = "ID_CGRC", nullable = false)
    private Long id;

    @Column(name = "RV_DOMAIN", nullable = false, length = 100)
    private String rvDomain;

    @Column(name = "RV_LOW_VALUE", nullable = false, length = 240)
    private String rvLowValue;

    @Column(name = "RV_HIGH_VALUE", length = 240)
    private String rvHighValue;

    @Column(name = "RV_ABBREVIATION", length = 240)
    private String rvAbbreviation;

    @Column(name = "RV_MEANING", length = 240)
    private String rvMeaning;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRvDomain() {
        return rvDomain;
    }

    public void setRvDomain(String rvDomain) {
        this.rvDomain = rvDomain;
    }

    public String getRvLowValue() {
        return rvLowValue;
    }

    public void setRvLowValue(String rvLowValue) {
        this.rvLowValue = rvLowValue;
    }

    public String getRvHighValue() {
        return rvHighValue;
    }

    public void setRvHighValue(String rvHighValue) {
        this.rvHighValue = rvHighValue;
    }

    public String getRvAbbreviation() {
        return rvAbbreviation;
    }

    public void setRvAbbreviation(String rvAbbreviation) {
        this.rvAbbreviation = rvAbbreviation;
    }

    public String getRvMeaning() {
        return rvMeaning;
    }

    public void setRvMeaning(String rvMeaning) {
        this.rvMeaning = rvMeaning;
    }

}