package com.example.backendagile.mapper;

import com.example.backendagile.dto.QualificatifDTO;
import com.example.backendagile.entities.Qualificatif;
import org.springframework.stereotype.Component;

@Component
public class QualificatifMapper {

    public QualificatifDTO toDto(Qualificatif qualificatif) {
        QualificatifDTO dto = new QualificatifDTO();
        dto.setMaximal(qualificatif.getMaximal());
        dto.setMinimal(qualificatif.getMinimal());
        return dto;
    }

    public Qualificatif toEntity(QualificatifDTO dto) {
        Qualificatif qualificatif = new Qualificatif();
        qualificatif.setMaximal(dto.getMaximal());
        qualificatif.setMinimal(dto.getMinimal());
        return qualificatif;
    }
}