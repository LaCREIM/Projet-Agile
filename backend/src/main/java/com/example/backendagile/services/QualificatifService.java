package com.example.backendagile.services;

import com.example.backendagile.entities.Qualificatif;
import com.example.backendagile.repositories.QualificatifRepository;
import com.example.backendagile.repositories.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Comparator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class QualificatifService {

    @Autowired
    private QualificatifRepository qualificatifRepository;

    @Autowired
    private QuestionRepository questionRepository;


    public Optional<Qualificatif> findById(Long id) {
        return qualificatifRepository.findById(id);
    }

    public Qualificatif save(Qualificatif qualificatif) {
        return qualificatifRepository.save(qualificatif);
    }

    public void deleteById(Long id) {
        qualificatifRepository.deleteById(id);
    }

    public Boolean existsDansQuestion(Long id) {
        return questionRepository.existsByQualificatifId(id);
    }

    public Optional<Qualificatif> findByMinimalAndMaximal(String minimal, String maximal) {
        return Optional.ofNullable(qualificatifRepository.findByDesignation(minimal, maximal));
    }
     public List<Qualificatif> findAll() {
        List<Qualificatif> qualificatifs = qualificatifRepository.findAll();
        return qualificatifs.stream()
                .sorted(Comparator.comparing(Qualificatif::getMinimal, String.CASE_INSENSITIVE_ORDER))
                .collect(Collectors.toList());
    }

   /*  public List<Qualificatif> searchQualificatifs(String searchTerm) {
        return qualificatifRepository.findByMinimalContainingIgnoreCaseOrMaximalContainingIgnoreCase(searchTerm, searchTerm);
    }
    */
    public List<Qualificatif> searchQualificatifsPaged(String keyword, int page, int size) {
        int startRow = (page - 1) * size;
        int endRow = page * size;
        String formattedKeyword = "%" + keyword + "%";  
        return qualificatifRepository.searchWithPagination(formattedKeyword, startRow, endRow);
    }
    public int getTotalPagesForSearch(String keyword, int size) {
        long totalCount = qualificatifRepository.countByMinimalContainingIgnoreCaseOrMaximalContainingIgnoreCase(keyword, keyword);
        return (int) Math.ceil((double) totalCount / size);
    }
    
    public List<Qualificatif> getAllQualificatifsPaged(int page, int size) {
        int startRow = (page - 1) * size;
        int endRow = page * size;
        return qualificatifRepository.findAllWithPagination(startRow, endRow);
    }
    
    public int getTotalPages(int size) {
        long totalItems = qualificatifRepository.count();
        return (int) Math.ceil((double) totalItems / size);
    }
    
    
}