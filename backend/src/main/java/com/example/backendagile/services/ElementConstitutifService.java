package com.example.backendagile.services;
import org.springframework.stereotype.Service;
import com.example.backendagile.repositories.ElementConstitutifRepository;
import com.example.backendagile.dto.ElementConstitutifDTO;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ElementConstitutifService {

    private final ElementConstitutifRepository elementConstitutifRepository;

    public ElementConstitutifService(ElementConstitutifRepository elementConstitutifRepository) {
        this.elementConstitutifRepository = elementConstitutifRepository;
    }

    public List<ElementConstitutifDTO> getAllECByCodeUE(String codeUe) {
        return elementConstitutifRepository.findByIdCodeUe(codeUe)
                .stream()
                .map(ec -> {
                    System.out.println("ID complet : " + ec.getId()); 
                    System.out.println("Code EC : " + ec.getId().getCodeEc()); 
                    return new ElementConstitutifDTO(
                        ec.getId().getCodeEc(),
                        ec.getDesignation()
                    );
                })                
                .collect(Collectors.toList());
    }
}

