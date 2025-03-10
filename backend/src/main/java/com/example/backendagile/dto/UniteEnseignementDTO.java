package com.example.backendagile.dto;

public class UniteEnseignementDTO {
    private String codeUE;
    private String designationUE;

    public UniteEnseignementDTO(String codeUE, String designation) {
        this.codeUE = codeUE;
        this.designationUE = designation;
    }

    public String getCodeUE() {
        return codeUE;
    }

    public void setCodeUE(String codeUE) {
        this.codeUE = codeUE;
    }

    public String getDesignationUE() {
        return designationUE;
    }

    public void setDesignationUE(String designation) {
        this.designationUE = designation;
    }
}
