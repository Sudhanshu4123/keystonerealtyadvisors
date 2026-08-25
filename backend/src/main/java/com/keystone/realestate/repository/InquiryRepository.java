package com.keystone.realestate.repository;

import com.keystone.realestate.model.Inquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InquiryRepository extends JpaRepository<Inquiry, String> {
    long countByStatus(String status);
    List<Inquiry> findTop5ByOrderByCreatedAtDesc();

    @Query("SELECT i FROM Inquiry i WHERE " +
           "(:status IS NULL OR i.status = :status) AND " +
           "(:search IS NULL OR LOWER(i.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(i.phone) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(i.email) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(i.message) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY i.createdAt DESC")
    List<Inquiry> searchInquiries(@Param("status") String status, @Param("search") String search);
}
