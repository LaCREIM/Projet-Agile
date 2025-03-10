package com.example.backendagile.dto;

public class ElementConstitutifDTO {
    private String codeEc;
    private String designation;

    public ElementConstitutifDTO() {
    }

    public ElementConstitutifDTO(String codeEc, String designation) {
        this.codeEc = codeEc;
        this.designation = designation;
    }

    public String getCodeEc() {
        return codeEc;
    }

    public void setCodeEc(String codeEc) {
        this.codeEc = codeEc;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }
}
