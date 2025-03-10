package com.example.backendagile.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backendagile.entities.ElementConstitutif;
import java.util.List;
import com.example.backendagile.entities.ElementConstitutifId;

public interface ElementConstitutifRepository extends JpaRepository<ElementConstitutif, ElementConstitutifId> {

    List<ElementConstitutif> findByIdCodeUe(String codeUe);


}
