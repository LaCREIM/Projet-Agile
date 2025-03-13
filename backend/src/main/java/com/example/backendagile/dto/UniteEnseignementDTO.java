package com.example.backendagile.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UniteEnseignementDTO {
    private String codeUE;
    private String designationUE;
    private String codeFormation;

    public UniteEnseignementDTO(String codeUE, String designationUE,String codeFormation) {
        this.codeUE = codeUE;
        this.designationUE = designationUE;
        this.codeFormation = codeFormation;
    }

}
