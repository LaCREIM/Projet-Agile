package com.example.backendagile.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UniteEnseignementDTO {
    private String codeUE;
    private String designationUE;

    public UniteEnseignementDTO(String codeUE, String designationUE) {
        this.codeUE = codeUE;
        this.designationUE = designationUE;
    }

}
